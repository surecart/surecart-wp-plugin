<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Rest\RestServiceInterface;
use CheckoutEngine\Controllers\Rest\ProductsController;

/**
 * Service provider for Price Rest Requests
 */
class ProductsRestServiceProvider extends RestServiceProvider implements RestServiceInterface {

	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'products';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = ProductsController::class;

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
				'id'      => [
					'description' => esc_html__( 'Unique identifier for the object.', 'checkout_engine' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				],
				'content' => array(
					'description' => esc_html__( 'The content for the object.', 'checkout_engine' ),
					'type'        => 'string',
				),
			],
		];

		return $this->schema;
	}

	/**
	 * Get the collection params.
	 *
	 * @return array
	 */
	public function get_collection_params() {
		return [
			'archived'          => [
				'description' => esc_html__( 'Whether to get archived products or not.', 'checkout_engine' ),
				'type'        => 'boolean',
			],
			'recurring'         => [
				'description' => esc_html__( 'Only return products that are recurring or not recurring (one time).', 'checkout_engine' ),
				'type'        => 'boolean',
			],
			'query'             => [
				'description' => __( 'The query to be used for full text search of this collection.' ),
				'type'        => 'string',
			],
			'ids'               => [
				'description' => __( 'Ensure result set excludes specific IDs.' ),
				'type'        => 'array',
				'items'       => [
					'type' => 'string',
				],
				'default'     => [],
			],
			'product_group_ids' => [
				'description' => __( 'Only return objects that belong to the given product groups.' ),
				'type'        => 'array',
				'items'       => [
					'type' => 'string',
				],
				'default'     => [],
			],
			'page'              => [
				'description' => esc_html__( 'The page of items you want returned.', 'checkout_engine' ),
				'type'        => 'integer',
			],
			'per_page'          => [
				'description' => esc_html__( 'A limit on the number of items to be returned, between 1 and 100.', 'checkout_engine' ),
				'type'        => 'integer',
			],
		];
	}

	/**
	 * Anyone can get a specific product.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return true;
	}

	/**
	 * Who can list products?
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		// anyone can get them if they have the ids.
		if ( ! empty( $request['ids'] ) && false === $request['archived'] ) {
			return true;
		}

		return current_user_can( 'edit_ce_products' );
	}

	/**
	 * Create model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		return current_user_can( 'publish_ce_products' );
	}

	/**
	 * Update model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return current_user_can( 'edit_ce_products' );
	}

	/**
	 * Delete model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'delete_ce_products' );
	}
}
