<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Rest\RestServiceInterface;
use CheckoutEngine\Controllers\Rest\SettingsController;

/**
 * Service provider for Price Rest Requests
 */
class SettingsRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'settings';

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
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => \CheckoutEngine::closure()->method( SettingsController::class, 'update' ),
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		$settings = \CheckoutEngine::get_registered_settings();

		// register read route for each setting.
		foreach ( $settings as $setting ) {
			register_rest_route(
				"$this->name/v$this->version",
				"$this->endpoint/{$setting->name}",
				[
					[
						'methods'             => \WP_REST_Server::READABLE,
						'callback'            => \CheckoutEngine::closure()->method( SettingsController::class, 'index' ),
						'permission_callback' => [ $this, 'get_item_permissions_check' ],
					],
					'schema' => [ $this, 'get_item_schema' ],
				]
			);
		}
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
			'properties' => apply_filters( 'checkout_engine/rest/settings/schema', [] ),
		];

		return $this->schema;
	}

	/**
	 * User must be able to manage options
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return true;
		return current_user_can( 'manage_options' );
	}
}
