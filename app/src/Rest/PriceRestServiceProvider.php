<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Rest\RestServiceInterface;
use CheckoutEngine\Controllers\Rest\PricesController;

/**
 * Service provider for Price Rest Requests
 */
class PriceRestServiceProvider extends RestServiceProvider implements RestServiceInterface {

	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'prices';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = PricesController::class;

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
	 * Anyone can get a specific price.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return true;
	}

	/**
	 * Who can list prices
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		// anyone can get them if they have the ids and are not trying to list archived prices.
		if ( ! empty( $request['ids'] ) && false === $request['archived'] ) {
			return true;
		}

		return current_user_can( 'read_ce_prices' );
	}

	/**
	 * Create model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		return current_user_can( 'publish_ce_prices' );
	}

	/**
	 * Update model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return current_user_can( 'edit_ce_prices' );
	}

	/**
	 * Delete model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'delete_ce_prices' );
	}
}
