<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Controllers\Rest\PaymentMethodsController;
use CheckoutEngine\Models\User;
use CheckoutEngine\Rest\RestServiceInterface;
use CheckoutEngine\Rest\Traits\CanListByCustomerIds;

/**
 * Service provider for Price Rest Requests
 */
class PaymentMethodsRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	use CanListByCustomerIds;

	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'payment_methods';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = PaymentMethodsController::class;

	/**
	 * Methods allowed for the model.
	 *
	 * @var array
	 */
	protected $methods = [ 'index', 'find' ];

		/**
		 * Register REST Routes
		 *
		 * @return void
		 */
	public function registerRoutes() {
		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/(?P<id>\S+)/detach/',
			[
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => $this->callback( $this->controller, 'detach' ),
					'permission_callback' => [ $this, 'detach_item_permissions_check' ],
				],
				// Register our schema callback.
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}


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
					'description' => esc_html__( 'Unique identifier for the object.', 'my-textdomain' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
			],
		];

		return $this->schema;
	}

	/**
	 * Read permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return current_user_can( 'read_ce_payment_method', $request['id'] );
	}

	/**
	 * Read permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function detach_item_permissions_check( $request ) {
		return current_user_can( 'edit_ce_payment_method', $request['id'] );
	}

	/**
	 * List permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		// a customer can list their own payment methods.
		if ( ! current_user_can( 'read_ce_payment_methods' ) ) {
			// they can list if they are listing their own customer id.
			return $this->isListingOwnCustomerId( $request );
		}

		// need read priveleges.
		return current_user_can( 'read_ce_payment_methods' );
	}

	/**
	 * Update permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return current_user_can( 'edit_ce_payment_methods' );
	}

	/**
	 * Delete permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return false
	 */
	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'delete_ce_payment_methods' );
	}
}
