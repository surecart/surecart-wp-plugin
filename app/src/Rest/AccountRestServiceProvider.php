<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Rest\RestServiceInterface;
use CheckoutEngine\Controllers\Rest\AccountController;

/**
 * Service provider for Price Rest Requests
 */
class AccountRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'account';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = AccountController::class;

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
				'id'         => [
					'description' => esc_html__( 'Unique identifier for the object.', 'checkout_engine' ),
					'type'        => 'string',
					'context'     => [ 'edit' ],
					'readonly'    => true,
				],
				'object'     => [
					'description' => esc_html__( 'Type of object (Account)', 'checkout_engine' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
					'readonly'    => true,
				],
				'created_at' => [
					'description' => esc_html__( 'Created at timestamp', 'checkout_engine' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
					'readonly'    => true,
				],
				'updated_at' => [
					'description' => esc_html__( 'Created at timestamp', 'checkout_engine' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
					'readonly'    => true,
				],
				'name'       => [
					'description' => esc_html__( 'The name of the account.', 'checkout_engine' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
				],
				'currency'   => [
					'description' => esc_html__( 'The default currency for the account.', 'checkout_engine' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
				],
				'owner'      => [
					'description' => esc_html__( 'Owner data.', 'checkout_engine' ),
					'type'        => 'object',
					'context'     => [ 'edit' ],
				],
				'processors' => [
					'description' => esc_html__( 'Connected processors', 'checkout_engine' ),
					'type'        => 'object',
					'context'     => [ 'edit' ],
				],
			],
		];

		return $this->schema;
	}

	/**
	 * Get items
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Update item
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}
}
