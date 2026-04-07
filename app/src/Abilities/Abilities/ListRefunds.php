<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Refund;

/**
 * List refunds.
 */
class ListRefunds extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/list-refunds';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'List Refunds', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a paginated list of SureCart refunds. Supports filtering by charge, customer, or return request. Returns refund summaries with amounts, statuses, and reasons.', 'surecart' );
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
		return 'Use this to browse or filter refunds. Filter by charge to see refunds for a specific payment, or by customer to see all refunds for a customer. Only known parameters are accepted: charge, customer, return_request, page, per_page.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_refunds' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'page'               => array(
					'type'        => 'integer',
					'description' => __( 'Page number for pagination.', 'surecart' ),
					'default'     => 1,
				),
				'per_page'           => array(
					'type'        => 'integer',
					'description' => __( 'Number of refunds per page (max 100).', 'surecart' ),
					'default'     => 10,
				),
				'charge_ids'         => array(
					'type'        => 'array',
					'items'       => array( 'type' => 'string' ),
					'description' => __( 'Only return refunds for the given charge IDs.', 'surecart' ),
				),
				'customer_ids'       => array(
					'type'        => 'array',
					'items'       => array( 'type' => 'string' ),
					'description' => __( 'Only return refunds that belong to the given customer IDs.', 'surecart' ),
				),
				'return_request_ids' => array(
					'type'        => 'array',
					'items'       => array( 'type' => 'string' ),
					'description' => __( 'Only return refunds that belong to the given return request IDs.', 'surecart' ),
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
				'success'    => array( 'type' => 'boolean' ),
				'refunds'    => array(
					'type'  => 'array',
					'items' => array( 'type' => 'object' ),
				),
				'pagination' => array(
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

		if ( ! empty( $input['charge_ids'] ) ) {
			$args['charge_ids'] = array_map( 'sanitize_text_field', $input['charge_ids'] );
		}

		if ( ! empty( $input['customer_ids'] ) ) {
			$args['customer_ids'] = array_map( 'sanitize_text_field', $input['customer_ids'] );
		}

		if ( ! empty( $input['return_request_ids'] ) ) {
			$args['return_request_ids'] = array_map( 'sanitize_text_field', $input['return_request_ids'] );
		}

		$refunds = Refund::where( $args )->paginate(
			array(
				'page'     => $page,
				'per_page' => $per_page,
			)
		);
		if ( is_wp_error( $refunds ) ) {
			return $refunds;
		}

		return $this->success(
			array(
				'refunds'    => array_map( array( $this, 'model_to_array' ), $refunds->data ?? array() ),
				'pagination' => array(
					'count' => $refunds->pagination->count ?? 0,
					'page'  => $page,
					'limit' => $per_page,
				),
			)
		);
	}
}
