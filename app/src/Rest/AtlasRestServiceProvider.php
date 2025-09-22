<?php

namespace SureCart\Rest;

use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\AtlasController;

/**
 * Service provider for Atlas Rest API.
 */
class AtlasRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'public/atlas';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = AtlasController::class;

	/**
	 * Methods allowed for the model.
	 *
	 * @var array
	 */
	protected $methods = [];

	/**
	 * Register Additional REST Routes
	 *
	 * @return void
	 */
	public function registerRoutes() {
		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint,
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => $this->callback( $this->controller, 'find' ),
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => $this->get_collection_params(),
				),
				// Register our schema callback.
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/(?P<iso_code>\S+)',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => $this->callback( $this->controller, 'getCountryDetails' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
				),
				// Register our schema callback.
				'schema' => array( $this, 'get_item_schema' ),
			)
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

		$this->schema = array(
			// This tells the spec of JSON Schema we are using which is draft 4.
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			// The title property marks the identity of the resource.
			'title'      => $this->endpoint,
			'type'       => 'object',
			// In JSON Schema you can specify object properties in the properties attribute.
			'properties' => array(
				'address_formats'      => array(
					'description' => esc_html__( 'The address edit & show formats.', 'surecart' ),
					'type'        => 'object',
				),
				'address_labels'       => array(
					'description' => esc_html__( 'The address fields labels.', 'surecart' ),
					'type'        => 'object',
				),
				'city_required'        => array(
					'description' => esc_html__( 'The city field is required or not.', 'surecart' ),
					'type'        => 'boolean',
				),
				'full_name'            => array(
					'description' => esc_html__( 'The full name of Country.', 'surecart' ),
					'type'        => 'string',
				),
				'iso_code'             => array(
					'description' => esc_html__( 'The iso code of Country.', 'surecart' ),
					'type'        => 'string',
				),
				'states'               => array(
					'description' => esc_html__( 'The states of Country.', 'surecart' ),
					'type'        => 'array',
				),
				'state_required'       => array(
					'description' => esc_html__( 'The state field is required or not.', 'surecart' ),
					'type'        => 'boolean',
				),
				'postal_code_required' => array(
					'description' => esc_html__( 'The postal code field is required or not.', 'surecart' ),
					'type'        => 'boolean',
				),
			),
		);

		return $this->schema;
	}

	/**
	 * Anyone can get countries list & details from Atlas API>
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return true;
	}
}
