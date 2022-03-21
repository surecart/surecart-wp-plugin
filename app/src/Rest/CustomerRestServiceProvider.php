<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Controllers\Rest\CustomerController;
use CheckoutEngine\Models\User;
use CheckoutEngine\Rest\RestServiceInterface;

/**
 * Service provider for Price Rest Requests
 */
class CustomerRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'customers';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = CustomerController::class;

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
				'id' => [
					'description' => esc_html__( 'Unique identifier for the object.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
			],
		];

		return $this->schema;
	}

	/**
	 * Does the current user match the customer?
	 *
	 * @param string $id Customer id.
	 *
	 * @return bool
	 */
	public function currentUserMatchesCustomerId( $id ) {
		$user = User::findByCustomerId( $id );
		if ( ! $user || is_wp_error( $user ) ) {
			return false;
		}

		// user can get their own customer record.
		if ( User::current()->ID === $user->ID ) {
			return true;
		}

		return false;
	}

	/**
	 * A WordPress user can read their own customer record.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		if ( $this->currentUserMatchesCustomerId( $request['id'] ) ) {
			return true;
		}

		// need to be able to read customers.
		return current_user_can( 'read_ce_customers' );
	}

	/**
	 * Read permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		return current_user_can( 'read_ce_customers' );
	}


	/**
	 * Create permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		return current_user_can( 'publish_ce_customers' );
	}

	/**
	 * Update permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		// if the current user matches the customer id.
		if ( ! current_user_can( 'edit_ce_customers' ) ) {
			if ( $this->currentUserMatchesCustomerId( $request['id'] ) ) {
				// whitelist specific params they are allowed to update.
				return $this->requestOnlyHasKeys( $request, [ 'billing_address', 'shipping_address', 'default_payment_method', 'tax_identifier', 'unsubscribed', 'phone', 'name', 'email' ] );
			}
		}

		return current_user_can( 'edit_ce_customers' );
	}

	/**
	 * Nobody can delete.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return false
	 */
	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'delete_ce_customers' );
	}
}
