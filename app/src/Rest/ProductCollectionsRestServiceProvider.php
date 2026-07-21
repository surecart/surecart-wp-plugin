<?php

namespace SureCart\Rest;

use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\ProductCollectionsController;

/**
 * Service provider for Product Collection Rest Requests
 */
class ProductCollectionsRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'product_collections';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = ProductCollectionsController::class;

	/**
	 * Filter index list items by schema context.
	 *
	 * @var boolean
	 */
	protected $filters_list_items = true;

	/**
	 * Get our sample schema for a post.
	 *
	 * @return array The sample schema for a post
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			// Since WordPress 5.3, the schema can be cached in the $schema property.
			return $this->schema;
		}

		$this->schema = [
			// This tells the spec of JSON Schema we are using which is draft 4.
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			// The title property marks the identity of the resource.
			'title'      => $this->endpoint,
			'type'       => 'object',
			// In JSON Schema you can specify object properties in the properties attribute.
			'properties' => [
				'id'          => [
					'description' => esc_html__( 'Unique identifier for the object.', 'surecart' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				],
				'metadata'    => [
					'description' => esc_html__( 'Set of key-value pairs for custom data.', 'surecart' ),
					'type'        => 'object',
					'context'     => [ 'edit' ],
				],
				'archived_at' => [
					'description' => esc_html__( 'Archived at timestamp.', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
				],
			],
		];

		return $this->schema;
	}

	/**
	 * You can get a specific product collection if you have the id.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		$check = $this->forbidEditContextWithout( $request, 'edit_sc_products' );
		if ( is_wp_error( $check ) ) {
			return $check;
		}

		return true;
	}

	/**
	 * Get the collection params.
	 *
	 * Plugins can extend this list via the
	 * `surecart/product_collections/rest_args` filter.
	 *
	 * @return array
	 */
	public function get_collection_params() {
		$args = [
			'query'    => [
				'description' => __( 'The query to be used for full text search of this collection.', 'surecart' ),
				'type'        => 'string',
			],
			'sort'     => [
				'description' => __( 'Sort directive in the form `field:direction`, e.g. `created_at:desc`.', 'surecart' ),
				'type'        => 'string',
			],
			'expand'   => [
				'description' => __( 'Relations to expand on each returned collection.', 'surecart' ),
				'type'        => 'array',
				'items'       => [ 'type' => 'string' ],
				'default'     => [],
			],
			'ids'         => [
				'description' => __( 'Filter the result set to specific IDs.', 'surecart' ),
				'type'        => 'array',
				'items'       => [ 'type' => 'string' ],
				'default'     => [],
			],
			'product_ids' => [
				'description' => __( 'Only return collections that contain the given products.', 'surecart' ),
				'type'        => 'array',
				'items'       => [ 'type' => 'string' ],
				'default'     => [],
			],
			'page'     => [
				'description' => esc_html__( 'The page of items you want returned.', 'surecart' ),
				'type'        => 'integer',
			],
			'per_page' => [
				'description' => esc_html__( 'A limit on the number of items to be returned, between 1 and 100.', 'surecart' ),
				'type'        => 'integer',
			],
		];

		/**
		 * Filter the product_collections REST collection params.
		 *
		 * @param array $args Args keyed by param name.
		 * @return array
		 */
		return apply_filters( 'surecart/product_collections/rest_args', $args );
	}

	/**
	 * You can get the product collection for edit context with permission
	 * and for view context make it public.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		$check = $this->forbidEditContextWithout( $request, 'edit_sc_products' );
		if ( is_wp_error( $check ) ) {
			return $check;
		}

		return true;
	}

	/**
	 * Create model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_products' );
	}

	/**
	 * Update model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_products' );
	}

	/**
	 * Delete model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_products' );
	}
}
