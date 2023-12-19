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
	 */
	public function __construct( $post = null ) {
		// either get by model id or integer (or global post).
		if ( is_string( $post ) ) {
			$post = $this->findBuModelId( $post );
		} else {
			$post = get_post( $post );
		}
		$this->post = $post;
	}

	/**
	 * Get the model type
	 *
	 * @return string
	 */
	public function getModelType() {
		return $this->model::getObjectName();
	}

	/**
	 * Get the post type.
	 *
	 * @return string
	 */
	public function getPostType() {
		return $this->post_type;
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
				'post_status'    => array( 'auto-draft', 'draft', 'publish', 'trash' ),
				'posts_per_page' => 1,
				'no_found_rows'  => true,
				'meta_query'     => array(
					array(
						'key'   => 'id',
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
		$args = wp_parse_args(
			$args,
			[
				'post_type' => $this->post_type,
			]
		);

		$posts = get_posts( $args );

		// map posts to a collection of post models.
		$posts = array_map(
			function( $post ) {
				return new static( $post );
			},
			$posts
		);

		return $posts;
	}

	/**
	 * Query the posts.
	 *
	 * @param array $args \WP_Query args.
	 *
	 * @return \WP_Query
	 */
	protected function query( $args ) {
		$args = wp_parse_args(
			$args,
			[
				'post_type' => $this->post_type,
			]
		);

		return new \WP_Query( $args );
	}

	/**
	 * Create the post.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return $this
	 */
	protected function create( \SureCart\Models\Model $model ) {
		$props = $this->getSchemaMap( $model );

		$post_id = wp_insert_post(
			wp_slash(
				array_merge(
					$props,
					[
						'tax_input' => [ // TODO: Add this custom taxonomy. We might want to query by store in case of store switch, or at least warn the user.
							'sc_store' => \SureCart::account()->id,
						],
					]
				)
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		return $this->find( $post_id );
	}

	/**
	 * Sync the product with the post.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return $this
	 */
	protected function sync( \SureCart\Models\Model $model ) {
		$post = $this->findByModelId( $model->id );

		if ( is_wp_error( $post ) ) {
			return $post;
		}

		if ( empty( $post->ID ) ) {
			$this->post = $this->create( $model );
			return $this;
		}

		$props      = $this->getSchemaMap( $model );
		$this->post = wp_update_post(
			array_merge(
				$props,
				[
					'ID' => $post->ID,
				]
			)
		);
		return $this;
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
			$this->additionalSchema( $model ),
			[
				'post_title'        => $model->name,
				'post_type'         => $this->post_type,
				'post_parent'       => $this->getPostParentId( $model ),
				'menu_order'        => $model->position ?? 0,
				'post_date'         => ( new \DateTime( "@$model->created_at" ) )->setTimezone( new \DateTimeZone( wp_timezone_string() ) )->format( 'Y-m-d H:i:s' ),
				'post_date_gmt'     => date_i18n( 'Y-m-d H:i:s', $model->created_at, true ),
				'post_modified'     => ( new \DateTime( "@$model->updated_at" ) )->setTimezone( new \DateTimeZone( wp_timezone_string() ) )->format( 'Y-m-d H:i:s' ),
				'post_modified_gmt' => date_i18n( 'Y-m-d H:i:s', $model->updated_at, true ),
				'post_status'       => ! property_exists( $model, 'status' ) || 'published' === $model->status ? 'publish' : 'draft',
				'meta_input'        => array_filter( $model->toArray(), 'is_scalar' ),
			]
		);
	}

	/**
	 * Get the id of the post parent.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return integer|null
	 * @throws \Exception If the parent model type is not set.
	 */
	protected function getPostParentId( \SureCart\Models\Model $model ) {
		// there is no parent, so don't set one.
		if ( empty( $this->parent ) ) {
			return null;
		}

		$parent = new $this->parent();

		// get the parent model type.
		$model_type = $parent->getModelType();

		// model type is not set.
		if ( empty( $model_type ) ) {
			throw new \Exception( 'Model not set in' . $this->parent );
		}

		// We can assume $model->property is the a string of the parent model id.
		if ( ! is_string( $model->{$model_type} ) ) {
			throw new \Exception( 'Parent model id is missing or invalid' );
		}

		// find the post by the parent model id.
		$post = $parent->findByModelId( $model->{$model_type} );

		// the parent id did not get created, let's create it.
		if ( empty( $post->ID ) ) {
			return null;
			// TODO: something was deleted, re-sync everything.
		}

		// return the post id.
		return $post->ID ?? null;
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
