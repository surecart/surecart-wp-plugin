<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Controllers\Rest\ChargesController;
use CheckoutEngine\Rest\RestServiceInterface;
use CheckoutEngine\Rest\Traits\CanListByCustomerIds;

/**
 * Service provider for Price Rest Requests
 */
class ChargesRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	use CanListByCustomerIds;

	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'charges';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = ChargesController::class;

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
			$this->endpoint . '/(?P<id>\S+)/refund/',
			[
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => $this->callback( $this->controller, 'refund' ),
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
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
	 * Check if the current user can read a charge.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return current_user_can( 'read_ce_charge', $request['id'] );
	}

	/**
	 * Need priveleges to read checkout sessions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		// if the current user can't read charges.
		if ( ! current_user_can( 'read_ce_charges' ) ) {
			// they can list if they are listing their own customer id.
			return $this->isListingOwnCustomerId( $request );
		}

		// need read priveleges.
		return current_user_can( 'read_ce_charges' );
	}
}
