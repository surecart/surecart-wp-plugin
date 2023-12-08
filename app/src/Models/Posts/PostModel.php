<?php
namespace SureCart\Models\Posts;

/**
 * Handles the product post type.
 */
abstract class PostModel {
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
	 * Disallow overriding the constructor in child classes and make the code safe that way.
	 */
	final public function __construct() {
	}

	/**
	 * Find the post from the model.
	 *
	 * @param string $model_id The model id.
	 *
	 * @return $this
	 */
	public function findByModelId( $model_id ) {
		$wp_query_args  = [
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
		];
		$template_query = new \WP_Query( $wp_query_args );
		$posts          = $template_query->posts;

		$this->post = apply_filters( "surecart_get_{$this->post_type}_post", $posts[0] ?? null, $model_id );

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
	 * Create the post.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return $this
	 */
	public function create( \SureCart\Models\Model $model ) {
		$props         = $this->getSchemaMap( $model );
		$prepared_post = array_merge(
			$props,
			[
				'tax_input' => [ // TODO: Add this custom taxonomy. We might want to query by store in case of store switch, or at least warn the user.
					'sc_store' => \SureCart::account()->id,
				],
			]
		);
		$post_id       = wp_insert_post( wp_slash( $prepared_post ), true );
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
	public function sync( \SureCart\Models\Model $model ) {
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
		return [
			'post_title'        => $model->name,
			'post_type'         => $this->post_type,
			'menu_order'        => $model->position ?? 0,
			'post_date'         => ( new \DateTime( "@$model->created_at" ) )->setTimezone( new \DateTimeZone( wp_timezone_string() ) )->format( 'Y-m-d H:i:s' ),
			'post_date_gmt'     => date_i18n( 'Y-m-d H:i:s', $model->created_at, true ),
			'post_modified'     => ( new \DateTime( "@$model->updated_at" ) )->setTimezone( new \DateTimeZone( wp_timezone_string() ) )->format( 'Y-m-d H:i:s' ),
			'post_modified_gmt' => date_i18n( 'Y-m-d H:i:s', $model->updated_at, true ),
			'post_status'       => ! property_exists( $model, 'status' ) || 'published' === $model->status ? 'publish' : 'draft',
			'meta_input'        => array_filter( $model->toArray(), 'is_scalar' ),
		];
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

		return $attribute;
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

	/**
	 * Forward call to method
	 *
	 * @param string $method Method to call.
	 * @param mixed  $params Method params.
	 */
	public function __call( $method, $params ) {
		return call_user_func_array( [ $this, $method ], $params );
	}

	/**
	 * Static Facade Accessor
	 *
	 * @param string $method Method to call.
	 * @param mixed  $params Method params.
	 *
	 * @return mixed
	 */
	public static function __callStatic( $method, $params ) {
		return call_user_func_array( [ new static(), $method ], $params );
	}
}
