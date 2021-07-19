<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Rest\RestServiceInterface;
use CheckoutEngine\Controllers\Rest\CheckoutSessionController;

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
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => \CheckoutEngine::closure()->method( CheckoutSessionController::class, 'create' ),
					'permission_callback' => [ $this, 'permissions_check' ],
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/(?P<id>[\S]+)',
			[
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => \CheckoutEngine::closure()->method( CheckoutSessionController::class, 'get' ),
					'permission_callback' => [ $this, 'permissions_check' ],
				],
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => \CheckoutEngine::closure()->method( CheckoutSessionController::class, 'update' ),
					'permission_callback' => [ $this, 'permissions_check' ],
				],
				// Register our schema callback.
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/(?P<id>[\S]+)/finalize/(?P<processor_type>[\S]+)',
			[
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => \CheckoutEngine::closure()->method( CheckoutSessionController::class, 'finalize' ),
					'permission_callback' => [ $this, 'permissions_check' ],
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
					'description' => esc_html__( 'Unique identifier for the object.', 'my-textdomain' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'currency'   => [
					'description' => esc_html__( 'The currency for the session.', 'my-textdomain' ),
					'type'        => 'string',
				],
				'line_items' => [
					'description' => esc_html__( 'The line items for the session.', 'my-textdomain' ),
					'type'        => 'object',
				],
			],
		];

		return $this->schema;
	}

	/**
	 * Anyone can get create checkout sessions
	 *
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function permissions_check() {
		return true;
	}
}
