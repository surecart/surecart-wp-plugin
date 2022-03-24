<?php

namespace SureCart\Rest;

use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\SubscriptionsController;
use SureCart\Models\User;
use SureCart\Rest\Traits\CanListByCustomerIds;

/**
 * Service provider for Price Rest Requests
 */
class SubscriptionRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	use CanListByCustomerIds;

	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'subscriptions';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = SubscriptionsController::class;

	/**
	 * Methods allowed for the model.
	 *
	 * @var array
	 */
	protected $methods = [ 'index', 'find', 'edit' ];

	/**
	 * Register REST Routes
	 *
	 * @return void
	 */
	public function registerRoutes() {
		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/(?P<id>\S+)/cancel/',
			[
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => $this->callback( $this->controller, 'cancel' ),
					'permission_callback' => [ $this, 'cancel_permissions_check' ],
				],
				// Register our schema callback.
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/(?P<id>\S+)/renew/',
			[
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => $this->callback( $this->controller, 'renew' ),
					'permission_callback' => [ $this, 'renew_permissions_check' ],
				],
				// Register our schema callback.
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/(?P<id>\S+)/upcoming_invoice/',
			[
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => $this->callback( $this->controller, 'upcomingInvoice' ),
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
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
				'id'           => [
					'description' => esc_html__( 'Unique identifier for the object.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'trial_end_at' => [
					'type'       => 'integer',
					'admin_only' => true,
				],
			],
		];

		return $this->schema;
	}

	/**
	 * Mark specific properties that need additional permissions checks
	 * before modifying. We don't want customers being able to modify these.
	 *
	 * @var array
	 */
	protected $property_permissions = [
		'skip_product_group_validation' => 'update_ce_subscriptions',
		'update_behavior'               => 'update_ce_subscriptions',
		'skip_proration'                => 'update_ce_subscriptions',
		'currency'                      => 'update_ce_subscriptions',
		'trial_end_at'                  => 'update_ce_subscriptions',
		'metadata'                      => 'update_ce_subscriptions',
		'customer'                      => 'update_ce_subscriptions',
		'discount'                      => 'update_ce_subscriptions',
	];

	/**
	 * Check cancel permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function cancel_permissions_check( $request ) {
		if ( current_user_can( 'edit_ce_subscriptions' ) ) {
			return true;
		}

		return current_user_can( 'edit_ce_subscription', $request['id'] );
	}

	/**
	 * Check cancel permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function renew_permissions_check( $request ) {
		if ( current_user_can( 'edit_ce_subscriptions' ) ) {
			return true;
		}

		return current_user_can( 'edit_ce_subscription', $request['id'] );
	}

	/**
	 * Anyone can get a specific subscription
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		if ( current_user_can( 'read_ce_subscriptions' ) ) {
			return true;
		}
		return current_user_can( 'read_ce_subscription', $request['id'] );
	}

	/**
	 * Need priveleges to read checkout sessions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		// if the current user can't read.
		if ( ! current_user_can( 'read_ce_subscriptions' ) ) {
			// they can list if they are listing their own customer id.
			return $this->isListingOwnCustomerId( $request );
		}

		// need read priveleges.
		return current_user_can( 'read_ce_subscriptions' );
	}

	/**
	 * Can the user preview an upcoming invoice?
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function preview_item_permissions_check( $request ) {
		return current_user_can( 'edit_ce_subscription', $request['id'] );
	}

	/**
	 * Anyone can update.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		if ( current_user_can( 'edit_ce_subscriptions' ) ) {
			return true;
		}

		// let customers modify pending cancel, quantity and price.
		// if request is sent with only these keys, then we can modify the subscription.
		// if they have permission to access it.
		if ( $this->requestOnlyHasKeys( $request, [ 'cancel_at_period_end', 'quantity', 'price', 'purge_pending_update' ] ) ) {
			return current_user_can( 'edit_ce_subscription', $request['id'] );
		}

		return false;
	}

	/**
	 * Nobody can delete.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return false
	 */
	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'delete_ce_subscriptions' );
	}
}
