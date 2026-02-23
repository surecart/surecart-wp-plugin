<?php

namespace SureCart\Rest;

use SureCart\Controllers\Rest\LearnProgressController;

/**
 * Service provider for Learn Progress REST requests.
 */
class LearnProgressRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'learn-progress';

	/**
	 * Methods allowed for the model.
	 *
	 * @var array
	 */
	protected $methods = [];

	/**
	 * Register REST Routes.
	 *
	 * @return void
	 */
	public function registerRoutes() {
		register_rest_route(
			"$this->name/v$this->version",
			"$this->endpoint",
			[
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => $this->callback( LearnProgressController::class, 'index' ),
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
				],
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => $this->callback( LearnProgressController::class, 'create' ),
					'permission_callback' => [ $this, 'create_item_permissions_check' ],
					'args'                => [
						'completed_steps' => [
							'required'          => true,
							'type'              => 'array',
							'items'             => [ 'type' => 'string' ],
							'sanitize_callback' => function ( $value ) {
								return array_map( 'sanitize_text_field', (array) $value );
							},
						],
					],
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}

	/**
	 * Check if the current user can read learn progress.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return true|\WP_Error
	 */
	public function get_items_permissions_check( $request ) {
		if ( ! current_user_can( 'edit_sc_products' ) ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to view learn progress.', 'surecart' ),
				[ 'status' => rest_authorization_required_code() ]
			);
		}
		return true;
	}

	/**
	 * Check if the current user can update learn progress.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return true|\WP_Error
	 */
	public function create_item_permissions_check( $request ) {
		if ( ! current_user_can( 'edit_sc_products' ) ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to update learn progress.', 'surecart' ),
				[ 'status' => rest_authorization_required_code() ]
			);
		}
		return true;
	}

	/**
	 * Get the schema for learn progress.
	 *
	 * @return array
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			return $this->schema;
		}

		$this->schema = [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => $this->endpoint,
			'type'       => 'object',
			'properties' => [
				'completed_steps' => [
					'description' => esc_html__( 'Array of completed step IDs.', 'surecart' ),
					'type'        => 'array',
					'items'       => [
						'type' => 'string',
					],
				],
			],
		];

		return $this->schema;
	}
}
