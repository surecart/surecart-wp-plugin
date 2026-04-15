<?php

namespace SureCart\Rest;

use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\CustomerAddressesController;

/**
 * Service provider for Customer Addresses REST requests.
 *
 * Provides a read-only endpoint for fetching the current
 * logged-in customer's shipping and billing addresses.
 */
class CustomerAddressesRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'customer-addresses';

	/**
	 * Methods allowed for the model.
	 *
	 * @var array
	 */
	protected $methods = [];

	/**
	 * Register REST Routes
	 *
	 * @return void
	 */
	public function registerRoutes() {
		register_rest_route(
			"$this->name/v$this->version",
			"$this->endpoint",
			[
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => $this->callback( CustomerAddressesController::class, 'getAddresses' ),
					'permission_callback' => [ $this, 'get_addresses_permissions_check' ],
					'args'                => [
						'mode' => [
							'type'              => 'string',
							'enum'              => [ 'live', 'test' ],
							'default'           => 'live',
							'sanitize_callback' => 'sanitize_text_field',
						],
					],
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}

	/**
	 * Get our sample schema for the response.
	 *
	 * @return array The schema for the response.
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			return $this->schema;
		}

		$this->schema = [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => $this->endpoint,
			'type'       => 'object',
			'properties' => [
				'shipping_address' => [
					'description' => esc_html__( 'The customer shipping address.', 'surecart' ),
					'type'        => [ 'object', 'array' ],
					'context'     => [ 'view', 'edit' ],
				],
				'billing_address'  => [
					'description' => esc_html__( 'The customer billing address.', 'surecart' ),
					'type'        => [ 'object', 'array' ],
					'context'     => [ 'view', 'edit' ],
				],
				'first_name'       => [
					'description' => esc_html__( 'The customer first name.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
				],
				'last_name'        => [
					'description' => esc_html__( 'The customer last name.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
				],
				'phone'            => [
					'description' => esc_html__( 'The customer phone number.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
				],
			],
		];

		return $this->schema;
	}

	/**
	 * Only logged-in users can fetch their own addresses.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return true|\WP_Error True if the request has access, WP_Error object otherwise.
	 */
	public function get_addresses_permissions_check( $request ) {
		if ( ! is_user_logged_in() ) {
			return new \WP_Error(
				'rest_not_logged_in',
				__( 'You must be logged in to access customer addresses.', 'surecart' ),
				[ 'status' => 401 ]
			);
		}
		return true;
	}
}
