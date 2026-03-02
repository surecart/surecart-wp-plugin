<?php

namespace SureCart\Rest;

use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\ReviewsController;

/**
 * Service provider for Review Rest Requests
 */
class ReviewsRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'reviews';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = ReviewsController::class;

	/**
	 * Register Additional REST Routes
	 *
	 * @return void
	 */
	public function registerRoutes() {
		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/(?P<id>\S+)/publish/',
			[
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => $this->callback( $this->controller, 'publish' ),
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
				],
				// Register our schema callback.
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/(?P<id>\S+)/unpublish/',
			[
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => $this->callback( $this->controller, 'unpublish' ),
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
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
				'id'       => [
					'description' => esc_html__( 'Unique identifier for the object.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'object'   => [
					'description' => esc_html__( 'Type of object.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'body'     => [
					'description' => esc_html__( 'Review body content.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
				],
				'status'   => [
					'description' => esc_html__( 'Review status.', 'surecart' ),
					'type'        => 'string',
					'enum'        => [ 'published', 'in_review', 'unpublished' ],
					'context'     => [ 'view', 'edit' ],
				],
				'title'    => [
					'description' => esc_html__( 'Review title.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
				],
				'stars'    => [
					'description' => esc_html__( 'Review rating in stars (1-5).', 'surecart' ),
					'type'        => 'integer',
					'minimum'     => 1,
					'maximum'     => 5,
					'context'     => [ 'view', 'edit' ],
				],
				'verified' => [
					'description' => esc_html__( 'Whether the review is verified.', 'surecart' ),
					'type'        => 'boolean',
					'context'     => [ 'view', 'edit' ],
					'readonly'    => true,
				],
				'customer' => [
					'description' => esc_html__( 'The customer who wrote the review.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
				],
				'product'  => [
					'description' => esc_html__( 'The product being reviewed.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
				],
				'purchase' => [
					'description' => esc_html__( 'The purchase associated with this review.', 'surecart' ),
					'type'        => [ 'string', 'null' ],
					'context'     => [ 'view', 'edit' ],
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
			'status'       => [
				'description' => esc_html__( 'Filter by review status.', 'surecart' ),
				'type'        => 'string',
				'enum'        => [ 'published', 'in_review', 'unpublished' ],
			],
			'product_ids'  => [
				'description' => esc_html__( 'Only return reviews for the given products.', 'surecart' ),
				'type'        => 'array',
				'items'       => [
					'type' => 'string',
				],
				'default'     => [],
			],
			'customer_ids' => [
				'description' => esc_html__( 'Only return reviews from the given customers.', 'surecart' ),
				'type'        => 'array',
				'items'       => [
					'type' => 'string',
				],
				'default'     => [],
			],
			'verified'     => [
				'description' => esc_html__( 'Only return verified or unverified reviews.', 'surecart' ),
				'type'        => 'boolean',
			],
			'query'        => [
				'description' => esc_html__( 'The query to be used for full text search of this collection.', 'surecart' ),
				'type'        => 'string',
			],
			'page'         => [
				'description' => esc_html__( 'The page of items you want returned.', 'surecart' ),
				'type'        => 'integer',
			],
			'per_page'     => [
				'description' => esc_html__( 'A limit on the number of items to be returned, between 1 and 100.', 'surecart' ),
				'type'        => 'integer',
			],
		];
	}

	/**
	 * Who can list reviews?
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		return current_user_can( 'read_sc_reviews' );
	}

	/**
	 * Who can get a specific review?
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return current_user_can( 'read_sc_reviews' );
	}

	/**
	 * Create review.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		// If customer, product, or purchase are passed, user must have edit_sc_reviews permission.
		if ( ! empty( $request->get_param( 'customer' ) ) || ! empty( $request->get_param( 'purchase' ) ) ) {
			return current_user_can( 'edit_sc_reviews' );
		}

		return is_user_logged_in();
	}

	/**
	 * Update review.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_reviews' );
	}

	/**
	 * Delete review.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'delete_sc_reviews' );
	}
}
