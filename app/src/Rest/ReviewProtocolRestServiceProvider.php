<?php

namespace SureCart\Rest;

use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\ReviewProtocolController;

/**
 * Service provider for ReviewProtocol Rest Requests
 */
class ReviewProtocolRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'review_protocol';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = ReviewProtocolController::class;

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
				'id'                         => [
					'description' => esc_html__( 'Unique identifier for the object.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'object'                     => [
					'description' => esc_html__( 'Type of object.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'reviews_enabled'            => [
					'description' => esc_html__( 'Whether reviews are enabled globally.', 'surecart' ),
					'type'        => 'boolean',
					'context'     => [ 'view', 'edit' ],
				],
				'solicit_reviews'            => [
					'description' => esc_html__( 'Whether to send review solicitation emails.', 'surecart' ),
					'type'        => 'boolean',
					'context'     => [ 'view', 'edit' ],
				],
				'solicit_reviews_after_days' => [
					'description' => esc_html__( 'Days after order fulfillment to send review solicitation email.', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit' ],
				],
			],
		];

		return $this->schema;
	}

	/**
	 * Anyone can get the review protocol.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return true;
	}

	/**
	 * Update review protocol.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return current_user_can( 'manage_sc_shop_settings' );
	}
}
