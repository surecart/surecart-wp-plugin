<?php

namespace SureCart\Rest;

use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\BumpsController;

/**
 * Service provider for Price Rest Requests
 */
class BumpRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'bumps';

	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = BumpsController::class;

	/**
	 * Filter index list items by schema context.
	 *
	 * @var boolean
	 */
	protected $filters_list_items = true;

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
				'id'                       => [
					'description' => esc_html__( 'Unique identifier for the object.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'object'                   => [
					'description' => esc_html__( 'Type of object (bump)', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
					'readonly'    => true,
				],
				'created_at'               => [
					'description' => esc_html__( 'Created at timestamp', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
					'readonly'    => true,
				],
				'updated_at'               => [
					'description' => esc_html__( 'Created at timestamp', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
					'readonly'    => true,
				],
				'archived'                 => [
					'description' => esc_html__( 'Whether the bump is archived.', 'surecart' ),
					'type'        => 'boolean',
					'context'     => [ 'edit' ],
				],
				'archived_at'              => [
					'description' => esc_html__( 'Archived at timestamp.', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
				],
				'amount_off'               => [
					'description' => esc_html__( 'Amount (in the currency of the price) that will be taken off line items associated with this bump.', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
				],
				'enabled'                  => [
					'description' => esc_html__( 'Whether or not this bump is currently enabled and being shown to customers.', 'surecart' ),
					'type'        => 'boolean',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'auto_apply'               => [
					'description' => esc_html__( 'Whether this bump is automatically applied when its conditions match.', 'surecart' ),
					'type'        => 'boolean',
					'context'     => [ 'edit' ],
				],
				'filters'                  => [
					'description' => esc_html__( 'The conditions that will filter this bump to be recommeneded. Accepted keys are price_ids, product_ids, and product_group_ids with array values.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'edit' ],
				],
				'filter_price_ids'         => [
					'description' => esc_html__( 'The price ids that filter this bump.', 'surecart' ),
					'type'        => 'array',
					'context'     => [ 'edit' ],
				],
				'filter_product_ids'       => [
					'description' => esc_html__( 'The product ids that filter this bump.', 'surecart' ),
					'type'        => 'array',
					'context'     => [ 'edit' ],
				],
				'filter_product_group_ids' => [
					'description' => esc_html__( 'The product group ids that filter this bump.', 'surecart' ),
					'type'        => 'array',
					'context'     => [ 'edit' ],
				],
				'filter_match_type'        => [
					'description' => esc_html__( 'How the filter conditions are matched – can be one of all, any, or none.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'edit' ],
				],
				'name'                     => [
					'description' => esc_html__( 'This is shown to the customer on invoices and line items.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'percent_off'              => [
					'description' => esc_html__( 'Percent that will be taken off line items associated with this bump.', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
				],
				'priority'                 => [
					'description' => esc_html__( 'The priority of this bump in relation to other bumps. Must be in the range of 1 - 5.', 'surecart' ),
					'type'        => 'integer',
					'context'     => [ 'edit' ],
				],
				'price'                    => [
					'description' => esc_html__( 'The UUID of the price.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'metadata'                 => [
					'description' => esc_html__( 'Set of key-value pairs for custom data.', 'surecart' ),
					'type'        => 'object',
					'context'     => [ 'edit' ],
					'properties'  => [
						'description' => [
							'description'       => esc_html__( 'Offer description.', 'surecart' ),
							'type'              => 'string',
							'sanitize_callback' => 'wp_kses_post',
						],
					],
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

		if ( ! $request['enabled'] ) {
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
