<?php

namespace SureCart\Rest;

use SureCart\Controllers\Rest\RefundsController;
use SureCart\Models\User;
use SureCart\Rest\RestServiceInterface;
use SureCart\Rest\Traits\CanListByCustomerIds;

/**
 * Service provider for Price Rest Requests
 */
class RefundsRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	use CanListByCustomerIds;

	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'refunds';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = RefundsController::class;

	/**
	 * Methods allowed for the model.
	 *
	 * @var array
	 */
	protected $methods = [ 'index', 'create', 'find' ];

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
	 * Read permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return current_user_can( 'read_ce_refund', $request['id'] );
	}

	/**
	 * List permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		// a customer can list their own sessions.
		if ( ! current_user_can( 'read_ce_refunds' ) ) {
			// they can list if they are listing their own customer id.
			return $this->isListingOwnCustomerId( $request );
		}

		// need read priveleges.
		return current_user_can( 'read_ce_refunds' );
	}

	/**
	 * Create
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		return current_user_can( 'publish_ce_refunds' );
	}
}
