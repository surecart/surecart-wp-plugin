<?php

namespace SureCart\Rest;

use SureCart\Concerns\StripsPrivateCatalogFields;
use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\PricesController;

/**
 * Service provider for Price Rest Requests
 */
class PriceRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	use StripsPrivateCatalogFields;

	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'prices';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = PricesController::class;

	/**
	 * Filter index list items by schema context.
	 *
	 * @var boolean
	 */
	protected $filters_list_items = true;

	/**
	 * Register Additional REST Routes
	 *
	 * @return void
	 */
	public function registerRoutes() {
		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/(?P<id>\S+)/duplicate',
			[
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => $this->callback( $this->controller, 'duplicate' ),
				'permission_callback' => [ $this, 'create_item_permissions_check' ],
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
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				],
				'content'      => array(
					'description' => esc_html__( 'The content for the object.', 'surecart' ),
					'type'        => 'string',
				),
				'metadata'     => [
					'description' => esc_html__( 'Set of key-value pairs for custom data.', 'surecart' ),
					'type'        => 'object',
					'context'     => [ 'edit' ],
				],
				'archived_at'  => [
					'description' => esc_html__( 'Archived at timestamp.', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
				],
				'discarded_at' => [
					'description' => esc_html__( 'Discarded at timestamp.', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
				],
			],
		];

		return $this->schema;
	}

	/**
	 * Get the collection params.
	 *
	 * @return array
	 */
	public function get_collection_params() {
		return [
			'archived'    => [
				'description' => esc_html__( 'Whether to get archived products or not.', 'surecart' ),
				'type'        => 'boolean',
			],
			'ad_hoc'      => [
				'description' => esc_html__( 'Only return prices that allow ad hoc amounts or not.', 'surecart' ),
				'type'        => 'boolean',
			],
			'query'       => [
				'description' => __( 'The query to be used for full text search of this collection.', 'surecart' ),
				'type'        => 'string',
			],
			'ids'         => [
				'description' => __( 'Ensure result set excludes specific IDs.', 'surecart' ),
				'type'        => 'array',
				'items'       => [
					'type' => 'string',
				],
				'default'     => [],
			],
			'product_ids' => [
				'description' => __( 'Only return objects that belong to the given products.', 'surecart' ),
				'type'        => 'array',
				'items'       => [
					'type' => 'string',
				],
				'default'     => [],
			],
			'page'        => [
				'description' => esc_html__( 'The page of items you want returned.', 'surecart' ),
				'type'        => 'integer',
			],
			'per_page'    => [
				'description' => esc_html__( 'A limit on the number of items to be returned, between 1 and 100.', 'surecart' ),
				'type'        => 'integer',
			],
		];
	}

	/**
	 * Anyone can get a specific price.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		$check = $this->forbidEditContextWithout( $request, 'edit_sc_prices' );
		if ( is_wp_error( $check ) ) {
			return $check;
		}

		return true;
	}

	/**
	 * Who can list prices
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		$check = $this->forbidEditContextWithout( $request, 'edit_sc_prices' );
		if ( is_wp_error( $check ) ) {
			return $check;
		}

		if ( $request['archived'] ) {
			return current_user_can( 'edit_sc_prices' );
		}

		return true;
	}

	/**
	 * Create model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		return current_user_can( 'publish_sc_prices' );
	}

	/**
	 * Update model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_prices' );
	}

	/**
	 * Delete model.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'delete_sc_prices' );
	}

	/**
	 * Strip private product data from expanded products in view/embed context.
	 *
	 * @param \SureCart\Models\Price|array $model Price model or response data.
	 * @param string                       $context The context of the request.
	 *
	 * @return array The filtered response.
	 */
	public function filter_response_by_context( $model, $context ) {
		$response = parent::filter_response_by_context( $model, $context );

		if ( 'edit' === $context || ! is_array( $response ) || empty( $response['id'] ) ) {
			return $response;
		}

		if ( ! empty( $response['product'] ) && is_array( $response['product'] ) ) {
			// draft product content must not leak through the expand — collapse to the id.
			// a missing status counts as published: archived products keep their name for
			// grandfathered plans on customer dashboards.
			if ( 'published' !== ( $response['product']['status'] ?? 'published' ) ) {
				// keep the key two-shaped: id string when collapsed, object when published.
				if ( empty( $response['product']['id'] ) ) {
					unset( $response['product'] );
				} else {
					$response['product'] = $response['product']['id'];
				}
			} else {
				$response['product'] = $this->stripPrivateProductFields( $response['product'] );
			}
		}

		return $response;
	}
}
