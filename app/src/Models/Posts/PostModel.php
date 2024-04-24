<?php
namespace SureCart\Models\Posts;

use SureCart\Models\Concerns\Facade;

/**
 * Handles the product post type.
 */
abstract class PostModel {
	use Facade;

	/**
	 * Holds the user.
	 *
	 * @var \WP_Post|null;
	 */
	protected $post;

	/**
	 * Holds the user.
	 *
	 * @var string
	 */
	protected $post_type = '';

	/**
	 * If this has a post parent class, set it here.
	 *
	 * @var \SureCart\Models\Posts\PostModel
	 */
	protected $parent = null;

	/**
	 * Product Model
	 *
	 * @var \SureCart\Models\Model
	 */
	protected $model;

	/**
	 * Disallow overriding the constructor in child classes and make the code safe that way.
	 *
	 * @param \WP_Post|null $post The post.
	 *
	 * @throws \Exception If the post is not found.
	 */
	public function __construct( $post = null ) {
		// either get by model id or integer (or global post).
		if ( is_string( $post ) ) {
			$this->findByModelId( $post );
		} else {
			$this->find( $post );
		}
	}

	/**
	 * Additional schema.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return array
	 */
	protected function additionalSchema( $model ) {
		return [];
	}

	/**
	 * Find the post from the model.
	 *
	 * @param string $model_id The model id.
	 *
	 * @return $this
	 */
	public function findByModelId( string $model_id ) {
		$query = new \WP_Query(
			[
				'post_type'      => $this->post_type,
				'post_status'    => array( 'auto-draft', 'draft', 'publish', 'trash', 'sc_archived' ),
				'posts_per_page' => 1,
				'no_found_rows'  => true,
				'meta_query'     => array(
					array(
						'key'   => 'sc_id',
						'value' => $model_id, // query by model id.
					),
				),
			]
		);

		$post = ! empty( $query->posts[0] ) ? $query->posts[0] : null;

		$this->post = apply_filters( "surecart_get_{$this->post_type}_post", $post, $model_id, $this );

		return $this;
	}

	/**
	 * Find the post from the model.
	 *
	 * @param string $id The model id.
	 *
	 * @return $this
	 */
	public function find( $id ) {
		$this->post = get_post( $id );
		return $this;
	}

	/**
	 * Get the posts.
	 *
	 * @param array $args \WP_Query args.
	 *
	 * @return array
	 */
	protected function get( $args ) {
		$query = $this->query( $args );
		return $query->posts;
	}

	/**
	 * Query the posts.
	 *
	 * @param array $args \WP_Query args.
	 *
	 * @return \WP_Query
	 */
	protected function query( $args ) {
		$query = new \WP_Query(
			wp_parse_args(
				$args,
				[
					'post_type'   => $this->post_type,
					'post_status' => 'publish',
				]
			)
		);

		// return the query.
		return $query;
	}

	/**
	 * Create the post.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return $this
	 */
	protected function create( \SureCart\Models\Model $model ) {
		// don't do these actions as they can slow down the sync.
		foreach ( [ 'do_pings', 'transition_post_status', 'save_post', 'pre_post_update', 'add_attachment', 'edit_attachment', 'edit_post', 'post_updated', 'wp_insert_post', 'save_post_' . $this->post_type ] as $action ) {
			remove_all_actions( $action );
		}

		// we are importing.
		if ( ! defined( 'WP_IMPORTING' ) ) {
			define( 'WP_IMPORTING', true );
		}

		// insert post.
		$post_id = wp_insert_post( wp_slash( $this->getSchemaMap( $model ) ), true, false );

		// handle errors.
		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		// we need to do this because tax_input checks permissions for some ungodly reason.
		wp_set_post_terms( $post_id, \SureCart::account()->id, 'sc_account' );

		$term_slugs = array_map( fn( $term ) => $term->name, $model->product_collections->data ?? [] );
		wp_set_post_terms( $post_id, $term_slugs, 'sc_collection' );

		// set the post on the model.
		$this->post = get_post( $post_id );

		return $this;
	}

	/**
	 * Update the post.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return $this
	 */
	protected function update( $model ) {
		$props = $this->getSchemaMap( $model );

		$post_id = wp_update_post(
			array_merge(
				$props,
				[
					'ID' => $this->post->ID,
				]
			)
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		$term_slugs = array_map( fn( $term ) => $term->name, $model->product_collections->data ?? [] );
		wp_set_post_terms( $post_id, $term_slugs, 'sc_collection' );

		$this->post = get_post( $post_id );

		return $this;
	}

	/**
	 * Delete the post.
	 *
	 * @param integer $id The id.
	 * @return $this
	 */
	protected function delete( $id = null ) {
		$deleted = wp_delete_post( $id ? $id : $this->post->ID, true );

		if ( is_wp_error( $deleted ) ) {
			return $deleted;
		}

		$this->post = null;

		return $this;
	}

	/**
	 * Sync the model with the post.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return $this
	 */
	protected function sync( \SureCart\Models\Model $model ) {
		$this->findByModelId( $model->id );

		if ( is_wp_error( $this->post ) ) {
			return $this->post;
		}

		return empty( $this->post->ID ) ? $this->create( $model ) : $this->update( $model );
	}

	/**
	 * Prepare the model schema for syncing to the post.
	 * This gets all declared "fillable" model items and inserts them as post meta.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return array
	 */
	protected function getMetaInput( \SureCart\Models\Model $model ) {
		$object     = new \stdClass();
		$properties = [
			'id',
			'available_stock',
			'stock_enabled',
			'allow_out_of_stock_purchases',
			'featured',
			'recurring',
			'shipping_enabled',
			'variants',
			'variant_options',
			'prices',
		];

		foreach ( $properties as $property ) {
			if ( isset( $model->$property ) ) {
				if ( 'id' === $property ) {
					$object->sc_id = $model->id;
				} else {
					$object->$property = $model->$property;
				}
			}
		}

		// add the product to the object.
		$object->product = $model;

		return $object;
	}

	/**
	 * Prepare the model schema for syncing to the post.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return array
	 */
	protected function getSchemaMap( \SureCart\Models\Model $model ) {
		return array_merge(
			[
				'post_title'        => $model->name,
				'post_name'         => $model->slug,
				'post_type'         => $this->post_type,
				'menu_order'        => $model->position ?? 0,
				'post_date'         => ( new \DateTime( "@$model->created_at" ) )->setTimezone( new \DateTimeZone( wp_timezone_string() ) )->format( 'Y-m-d H:i:s' ),
				'post_date_gmt'     => date_i18n( 'Y-m-d H:i:s', $model->created_at, true ),
				'post_modified'     => ( new \DateTime( "@$model->updated_at" ) )->setTimezone( new \DateTimeZone( wp_timezone_string() ) )->format( 'Y-m-d H:i:s' ),
				'post_modified_gmt' => date_i18n( 'Y-m-d H:i:s', $model->updated_at, true ),
				'post_status'       => $this->getPostStatusFromModel( $model ),
				'meta_input'        => $this->getMetaInput( $model ),
			],
			$this->additionalSchema( $model ),
		);
	}

	/**
	 * Add archived to the post meta.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return string
	 */
	protected function getPostStatusFromModel( \SureCart\Models\Model $model ) {
		// if it's archived, use that.
		if ( $model->archived ) {
			return 'sc_archived';
		}

		// if it's draft, use that.
		if ( 'draft' === ( $model->status ?? '' ) ) {
			return 'draft';
		}

		// default to publish.
		return 'publish';
	}

	/**
	 * Set the collection.
	 *
	 * @param object $value The value.
	 * @param string $model The model.
	 *
	 * @return $this
	 */
	protected function getCollection( $value, $model ) {
		$models = [];
		if ( ! empty( $value->data ) && is_array( $value->data ) ) {
			foreach ( $value->data as $attributes ) {
				$models[] = is_a( $attributes, $model ) ? $attributes : new $model( $attributes );
			}
			$value->data = $models;
		}
		return $value;
	}

	/**
	 * Get a specific attribute
	 *
	 * @param string $key Attribute name.
	 *
	 * @return mixed
	 */
	public function getAttribute( $key ) {
		$attribute = null;

		if ( $this->hasAttribute( $key ) ) {
			$attribute = $this->post->$key;
		}

		$getter = $this->getMutator( $key, 'get' );

		if ( $getter ) {
			return $this->{$getter}( $attribute );
		} elseif ( ! is_null( $attribute ) ) {
			return $attribute;
		}

		return $attribute;
	}

	/**
	 * Calls a mutator based on set{Attribute}Attribute
	 *
	 * @param string $key Attribute key.
	 * @param mixed  $type 'get' or 'set'.
	 *
	 * @return string|false
	 */
	public function getMutator( $key, $type ) {
		$key = ucwords( str_replace( [ '-', '_' ], ' ', $key ) );

		$method = $type . str_replace( ' ', '', $key ) . 'Attribute';

		if ( method_exists( $this, $method ) ) {
			return $method;
		}

		return false;
	}

	/**
	 * Sets a user attribute
	 * Optionally calls a mutator based on set{Attribute}Attribute
	 *
	 * @param string $key Attribute key.
	 * @param mixed  $value Attribute value.
	 *
	 * @return mixed|void
	 */
	public function setAttribute( $key, $value ) {
		$this->post->$key = $value;
	}

	/**
	 * Does it have the attribute
	 *
	 * @param string $key Attribute key.
	 *
	 * @return boolean
	 */
	public function hasAttribute( $key ) {
		return $this->post->$key ?? false;
	}

	/**
	 * Serialize to json.
	 *
	 * @return Array
	 */
	#[\ReturnTypeWillChange]
	public function jsonSerialize() {
		return $this->post->to_array();
	}

	/**
	 * Get the model attributes
	 *
	 * @return array
	 */
	public function getAttributes() {
		return json_decode( wp_json_encode( $this->post->to_array() ), true );
	}

	/**
	 * Calls accessors during toArray.
	 *
	 * @return Array
	 */
	public function toArray() {
		$attributes = $this->getAttributes();

		// Check if any accessor is available and call it.
		foreach ( get_class_methods( $this ) as $method ) {
			if ( method_exists( get_class(), $method ) ) {
				continue;
			}

			if ( 'get' === substr( $method, 0, 3 ) && 'Attribute' === substr( $method, -9 ) ) {
				$key = str_replace( [ 'get', 'Attribute' ], '', $method );
				if ( $key ) {
					$pieces             = preg_split( '/(?=[A-Z])/', $key );
					$pieces             = array_map( 'strtolower', array_filter( $pieces ) );
					$key                = implode( '_', $pieces );
					$value              = array_key_exists( $key, $this->post->to_array() ?? [] ) ? $this->post->to_array()[ $key ] : null;
					$attributes[ $key ] = $this->{$method}( $value );
				}
			}
		}

		// fetch with post meta.
		if ( $this->post->ID ) {
			$meta = get_post_meta( $this->post->ID );
			foreach ( $meta as $key => $value ) {
				$attributes[ $key ] = maybe_unserialize( $value[0] );
			}
		}

		// Check if any attribute is a model and call toArray.
		array_walk_recursive(
			$attributes,
			function ( &$value, $key ) {
				if ( $value instanceof PostModel ) {
					$value = $value->toObject();
				}
			}
		);

		return $attributes;
	}

	/**
	 * Get the attribute
	 *
	 * @param string $key Attribute name.
	 *
	 * @return mixed
	 */
	public function __get( $key ) {
		return $this->getAttribute( $key );
	}

	/**
	 * Set the attribute
	 *
	 * @param string $key Attribute name.
	 * @param mixed  $value Value of attribute.
	 *
	 * @return void
	 */
	public function __set( $key, $value ) {
		$this->setAttribute( $key, $value );
	}

	/**
	 * Determine if the given attribute exists.
	 *
	 * @param  mixed $offset Name.
	 * @return bool
	 */
	public function offsetExists( $offset ): bool {
		return ! is_null( $this->getAttribute( $offset ) );
	}

	/**
	 * Get the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @return mixed
	 */
	#[\ReturnTypeWillChange]
	public function offsetGet( $offset ) {
		return $this->getAttribute( $offset );
	}

	/**
	 * Set the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @param  mixed $value Value.
	 * @return void
	 */
	public function offsetSet( $offset, $value ): void {
		$this->setAttribute( $offset, $value );
	}

	/**
	 * Unset the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @return void
	 */
	public function offsetUnset( $offset ) : void {
		$this->post->$offset = null;
	}

	/**
	 * Get the user object.
	 *
	 * @return \WP_User|null
	 */
	public function getUser() {
		return $this->post;
	}

	/**
	 * Determine if an attribute or relation exists on the model.
	 *
	 * @param  string $key Name.
	 * @return bool
	 */
	public function __isset( $key ) {
		return $this->offsetExists( $key );
	}

	/**
	 * Unset an attribute on the model.
	 *
	 * @param  string $key Name.
	 * @return void
	 */
	public function __unset( $key ) {
		$this->offsetUnset( $key );
	}
}
