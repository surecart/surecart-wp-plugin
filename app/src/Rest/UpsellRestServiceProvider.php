<?php

namespace SureCart\Rest;

use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\UpsellsController;

/**
 * Service provider for Price Rest Requests
 */
class UpsellRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'upsells';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = UpsellsController::class;

	/**
	 * Filter index list items by schema context.
	 *
	 * @var boolean
	 */
	protected $filters_list_items = true;

	/**
	 * Whether the rest service provider converts currency.
	 *
	 * @var boolean
	 */
	protected $converts_currency = true;

	/**
	 * Methods allowed for the model.
	 *
	 * @var array
	 */
	protected $methods = [ 'index', 'create', 'find', 'edit', 'delete' ];

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
				'id'                          => [
					'description' => esc_html__( 'Unique identifier for the object.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'object'                      => [
					'description' => esc_html__( 'Type of object (upsell)', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'created_at'                  => [
					'description' => esc_html__( 'Created at timestamp', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'updated_at'                  => [
					'description' => esc_html__( 'Created at timestamp', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'amount_off'                  => [
					'description' => esc_html__( 'Amount (in the currency of the price) that will be taken off line items associated with this upsell.', 'surecart' ),
					'type'        => [ 'integer', 'null' ],
					'context'     => [ 'edit' ],
				],
				'duplicate_purchase_behavior' => [
					'description' => esc_html__( 'How to handle duplicate purchases of the product – can be one of allow, block_within_checkout, or block.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'replacement_behavior'        => [
					'description' => esc_html__( 'How this upsell replaces line items when accepted.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'edit' ],
				],
				'fee_description'             => [
					'description' => esc_html__( 'The description for this upsell which will be visible to customers.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'percent_off'                 => [
					'description' => esc_html__( 'Percent that will be taken off line items associated with this upsell.', 'surecart' ),
					'type'        => [ 'integer', 'null' ],
					'context'     => [ 'edit' ],
				],
				'step'                        => [
					'description' => esc_html__( 'Where this upsell falls in position within the upsell funnel – can be one of initial, accepted, or declined.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'price'                       => [
					'description' => esc_html__( 'The UUID of the price.', 'surecart' ),
					'type'        => [ 'string', 'object' ],
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'priority'                    => [
					'description' => esc_html__( 'The priority of this upsell in relation to other upsells.', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
				],
				'filter_price_ids'            => [
					'description' => esc_html__( 'The price ids that filter this upsell.', 'surecart' ),
					'type'        => 'array',
					'context'     => [ 'edit' ],
				],
				'filter_product_ids'          => [
					'description' => esc_html__( 'The product ids that filter this upsell.', 'surecart' ),
					'type'        => 'array',
					'context'     => [ 'edit' ],
				],
				'filter_product_group_ids'    => [
					'description' => esc_html__( 'The product group ids that filter this upsell.', 'surecart' ),
					'type'        => 'array',
					'context'     => [ 'edit' ],
				],
				'filter_match_type'           => [
					'description' => esc_html__( 'How the filter conditions are matched – can be one of all, any, or none.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'edit' ],
				],
				'metadata'                    => [
					'description' => esc_html__( 'Set of key-value pairs for custom data.', 'surecart' ),
					'type'        => 'object',
					'context'     => [ 'edit' ],
				],
			],
		];

		return $this->schema;
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

		if ( empty( $request['upsell_funnel_ids'] ) || count( $request['upsell_funnel_ids'] ) > 1 ) {
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
}
