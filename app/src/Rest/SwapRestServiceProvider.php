<?php

namespace SureCart\Rest;

use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\SwapsController;

/**
 * Service provider for Swaps
 */
class SwapRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'swaps';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = SwapsController::class;

	/**
	 * Methods allowed for the model.
	 *
	 * @var array
	 */
	protected $methods = [ 'index', 'create', 'find', 'edit', 'delete' ];


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
				'id'           => [
					'description' => esc_html__( 'Unique identifier for the object.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'object'       => [
					'description' => esc_html__( 'Type of object (swap)', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
					'readonly'    => true,
				],
				'created_at'   => [
					'description' => esc_html__( 'Created at timestamp', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
					'readonly'    => true,
				],
				'updated_at'   => [
					'description' => esc_html__( 'Created at timestamp', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
					'readonly'    => true,
				],
				'discarded_at' => [
					'description' => esc_html__( 'Time at which the object was discarded. Measured in seconds since the Unix epoch.', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
					'readonly'    => true,
				],
				'archived_at'  => [
					'description' => esc_html__( 'Time at which the object was archived. Measured in seconds since the Unix epoch.', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
					'readonly'    => true,
				],
				'description'  => [
					'description' => esc_html__( 'A description of this swap. This text will be visibile to customers in the checkout summary when offered the swap.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'metadata'     => [
					'description' => esc_html__( 'Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.', 'surecart' ),
					'type'        => 'object',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'price'        => [
					'description' => esc_html__( 'The associated price to swap from.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'swap_price'   => [
					'description' => esc_html__( 'The associated price to swap to.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'archived'     => [
					'description' => esc_html__( 'Whether or not this swap is archived.', 'surecart' ),
					'type'        => 'boolean',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
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
		return current_user_can( 'edit_sc_prices' );
	}

	/**
	 * Who can list prices
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		return current_user_can( 'edit_sc_prices' );
	}

	/**
	 * Create model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		return current_user_can( 'publish_sc_prices' );
	}

	/**
	 * Update model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_prices' );
	}

	/**
	 * Delete model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'delete_sc_prices' );
	}
}
