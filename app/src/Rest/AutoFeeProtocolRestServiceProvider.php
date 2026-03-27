<?php

namespace SureCart\Rest;

use SureCart\Controllers\Rest\AutoFeeProtocolController;
use SureCart\Rest\RestServiceInterface;

/**
 * Service provider for Price Rest Requests
 */
class AutoFeeProtocolRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'auto_fee_protocol';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = AutoFeeProtocolController::class;

	/**
	 * Methods allowed for the model.
	 *
	 * @var array
	 */
	protected $methods = [ 'find', 'edit' ];

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
				'id'                                       => array(
					'description' => esc_html__( 'Unique identifier for the object.', 'surecart' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'negative_checkout_fee_selection_strategy' => [
					'description' => esc_html__( 'Negative Checkout Fee Selection Strategy.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'negative_line_item_fee_selection_strategy' => [
					'description' => esc_html__( 'Negative Line Item Fee Selection Strategy.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'negative_shipping_fee_selection_strategy' => [
					'description' => esc_html__( 'Negative Shipping Fee Selection Strategy.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'positive_checkout_fee_selection_strategy' => [
					'description' => esc_html__( 'Positive Checkout Fee Selection Strategy.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'positive_line_item_fee_selection_strategy' => [
					'description' => esc_html__( 'Positive Line Item Fee Selection Strategy.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'positive_shipping_fee_selection_strategy' => [
					'description' => esc_html__( 'Positive Shipping Fee Selection Strategy.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
			],
		];

		return $this->schema;
	}

	/**
	 * Register REST Routes
	 *
	 * @return void
	 */
	public function registerRoutes() {
		register_rest_route(
			"$this->name/v$this->version",
			"$this->endpoint",
			array_filter(
				[
					[
						'methods'             => \WP_REST_Server::READABLE,
						'callback'            => $this->callback( $this->controller, 'find' ),
						'permission_callback' => [ $this, 'get_item_permissions_check' ],
						'args'                => $this->get_collection_params(),
					],
					[
						'methods'             => \WP_REST_Server::EDITABLE,
						'callback'            => $this->callback( $this->controller, 'edit' ),
						'permission_callback' => [ $this, 'update_item_permissions_check' ],
					],
					'schema' => [ $this, 'get_item_schema' ],
				]
			)
		);
	}
	/**
	 * Get item
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_prices' );
	}

	/**
	 * Need priveleges to update.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_prices' );
	}
}
