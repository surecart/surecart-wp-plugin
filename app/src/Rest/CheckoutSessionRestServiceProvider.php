<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Rest\RestServiceInterface;
use CheckoutEngine\Controllers\Rest\CheckoutSessionController;
use CheckoutEngine\Models\Form;
use CheckoutEngine\Models\User;

/**
 * Service provider for Price Rest Requests
 */
class CheckoutSessionRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'checkout_sessions';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = CheckoutSessionController::class;

	/**
	 * Methods allowed for the model.
	 *
	 * @var array
	 */
	protected $methods = [ 'index', 'create', 'find', 'edit' ];

	/**
	 * Register REST Routes
	 *
	 * @return void
	 */
	public function registerRoutes() {
		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/(?P<id>\S+)/finalize/(?P<processor_type>\S+)',
			[
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => $this->callback( CheckoutSessionController::class, 'finalize' ),
					'permission_callback' => [ $this, 'finalize_permissions_check' ],
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
				'id'         => [
					'description' => esc_html__( 'Unique identifier for the object.', 'checkout_engine' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'currency'   => [
					'description' => esc_html__( 'The currency for the session.', 'checkout_engine' ),
					'type'        => 'string',
				],
				'line_items' => [
					'description' => esc_html__( 'The line items for the session.', 'checkout_engine' ),
					'type'        => 'object',
				],
				'discount'   => [
					'description' => esc_html__( 'The discount for the session.', 'checkout_engine' ),
					'type'        => 'object',
				],
			],
		];

		return $this->schema;
	}

	/**
	 * Anyone can finalize checkout sessions.
	 *
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function finalize_permissions_check( \WP_REST_Request $request ) {
		// form id is required.
		if ( empty( $request['form_id'] ) ) {
			return new \WP_Error( 'form_id_required', esc_html__( 'Form ID is required.', 'checkout_engine' ), [ 'status' => 400 ] );
		}

		// get form.
		$form = get_post( $request['form_id'] );

		if ( ! $form || 'ce_form' !== Form::getPostType() ) {
			// TODO: check form manual registration on server here. (ce_register_form)

			// form not found.
			return new \WP_Error( 'form_id_invalid', esc_html__( 'Form ID is invalid.', 'checkout_engine' ), [ 'status' => 400 ] );
		}

		return true;
	}

	/**
	 * Anyone can get a specific session if they have the unique session id.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return true;
	}

	/**
	 * Listing
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		// a customer can list their own sessions.
		if ( isset( $request['customer_ids'] ) && 1 === count( $request['customer_ids'] ) ) {
			return User::find()->customerId() === $request['customer_ids'][0];
		}

		// need read priveleges.
		return current_user_can( 'read_pk_checkout_sessions' );
	}

	/**
	 * Anyone can create.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		return true;
	}

	/**
	 * Update permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return true;
	}

	/**
	 * Nobody can delete.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return false
	 */
	public function delete_item_permissions_check( $request ) {
		return false;
	}
}
