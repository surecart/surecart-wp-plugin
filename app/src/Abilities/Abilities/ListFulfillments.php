<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Fulfillment;

/**
 * List fulfillments with filters.
 */
class ListFulfillments extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/list-fulfillments';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'List Fulfillments', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a paginated list of SureCart fulfillments. Supports filtering by order and shipment status. Returns fulfillment summaries with tracking information and item counts.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_annotations(): array {
		return array(
			'readonly'    => true,
			'destructive' => false,
			'idempotent'  => true,
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_instructions(): string {
		return 'Use this to browse or filter fulfillments. Filter by order_ids to see fulfillments for specific orders, or by shipment_status to find pending/shipped/delivered fulfillments. Only known parameters are accepted: order_ids, shipment_status, page, per_page.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'edit_sc_orders' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'order_ids'       => array(
					'type'        => 'array',
					'items'       => array( 'type' => 'string' ),
					'description' => __( 'Filter fulfillments by order IDs.', 'surecart' ),
				),
				'shipment_status' => array(
					'type'        => 'string',
					'description' => __( 'Filter by shipment status: unshippable, unshipped, shipped, or delivered.', 'surecart' ),
				),
				'page'            => array(
					'type'        => 'integer',
					'description' => __( 'Page number for pagination.', 'surecart' ),
					'default'     => 1,
				),
				'per_page'        => array(
					'type'        => 'integer',
					'description' => __( 'Number of fulfillments per page (max 100).', 'surecart' ),
					'default'     => 10,
				),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'success'      => array( 'type' => 'boolean' ),
				'fulfillments' => array(
					'type'  => 'array',
					'items' => array( 'type' => 'object' ),
				),
				'pagination'   => array(
					'type'       => 'object',
					'properties' => array(
						'count' => array( 'type' => 'integer' ),
						'page'  => array( 'type' => 'integer' ),
						'limit' => array( 'type' => 'integer' ),
					),
				),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ) {
		$page     = absint( $input['page'] ?? 1 );
		$per_page = max( 1, min( absint( $input['per_page'] ?? 10 ), 100 ) );

		$args = array();

		if ( ! empty( $input['order_ids'] ) ) {
			$order_ids = $input['order_ids'];
			// Handle single string ID or JSON string input.
			if ( is_string( $order_ids ) ) {
				$decoded   = json_decode( $order_ids, true );
				$order_ids = is_array( $decoded ) ? $decoded : array( $order_ids );
			}
			$args['order_ids'] = array_map( 'sanitize_text_field', $order_ids );
		}

		if ( ! empty( $input['shipment_status'] ) ) {
			$status = sanitize_text_field( $input['shipment_status'] );
			// API expects shipment_status as an array.
			$args['shipment_status'] = array( $status );
		}

		$fulfillments = Fulfillment::where( $args )->paginate(
			array(
				'page'     => $page,
				'per_page' => $per_page,
			)
		);
		if ( is_wp_error( $fulfillments ) ) {
			return $fulfillments;
		}

		return $this->success(
			array(
				'fulfillments' => array_map( array( $this, 'model_to_array' ), $fulfillments->data ?? array() ),
				'pagination'   => array(
					'count' => $fulfillments->pagination->count ?? 0,
					'page'  => $page,
					'limit' => $per_page,
				),
			)
		);
	}
}
