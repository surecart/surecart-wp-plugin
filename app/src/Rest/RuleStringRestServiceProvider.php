<?php

namespace SureCart\Rest;

use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\RuleStringController;

/**
 * Service provider for Price Rest Requests
 */
class RuleStringRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'rule_strings';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = RuleStringController::class;

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
			'object'     => 'rule_schema',
			'attributes' => array(),
		];

		return $this->schema;
	}

	/**
	 * Register REST Routes
	 *
	 * @return void
	 */
	public function registerRoutes() {
		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/construct',
			[
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => $this->callback( $this->controller, 'construct' ),
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
				],
				// Register our schema callback.
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/deconstruct',
			[
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => $this->callback( $this->controller, 'deconstruct' ),
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
				],
				// Register our schema callback.
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}

	/**
	 * Anyone can get a specific price.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return true;
	}
}
