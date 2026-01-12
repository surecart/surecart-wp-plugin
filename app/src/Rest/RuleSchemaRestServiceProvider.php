<?php

namespace SureCart\Rest;

use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\RuleSchemaController;

/**
 * Service provider for Swaps
 */
class RuleSchemaRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'auto_fees/rule_schema';

	/**
	 * Methods allowed for the model.
	 *
	 * @var array
	 */
	protected $methods = [ 'find' ];

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = RuleSchemaController::class;

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
				'schema_id'  => [
					'description' => esc_html__( 'Unique identifier for the object.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'object'     => [
					'description' => esc_html__( 'Type of object (rule_schema)', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
					'readonly'    => true,
				],
				'attributes' => [
					'description' => esc_html__( 'Attributes of a Rule Schema', 'surecart' ),
					'type'        => 'array',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
			],
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
			$this->endpoint . '/(?P<id>\S+)',
			[
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => $this->callback( $this->controller, 'find' ),
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
				],
				// Register our schema callback.
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint,
			[
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => $this->callback( $this->controller, 'find' ),
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
				],
				// Register our schema callback.
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}
	/**
	 * Only users with the edit_sc_prices capability can get a specific data.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_prices' );
	}
}
