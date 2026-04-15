<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Promotion;

/**
 * List active promotions.
 */
class ListPromotions extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/list-promotions';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'List Promotions', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a paginated list of SureCart promotions. Supports filtering by associated coupon and customer. Returns promotion codes, IDs, and linked coupon details.', 'surecart' );
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
		return 'Use this to browse or filter promotion codes. Filter by coupon_ids to see promotions for a specific coupon, or by customer to see customer-specific promotions. Only known parameters are accepted: coupon_ids, customer, page, per_page.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_promotions' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'archived'     => array(
					'type'        => 'boolean',
					'description' => __( 'Whether to include archived promotions.', 'surecart' ),
					'default'     => false,
				),
				'coupon_ids'   => array(
					'type'        => 'array',
					'items'       => array( 'type' => 'string' ),
					'description' => __( 'Only return promotions with the given coupon IDs.', 'surecart' ),
				),
				'customer_ids' => array(
					'type'        => 'array',
					'items'       => array( 'type' => 'string' ),
					'description' => __( 'Only return promotions belonging to the given customers.', 'surecart' ),
				),
				'ids'          => array(
					'type'        => 'array',
					'items'       => array( 'type' => 'string' ),
					'description' => __( 'Only return promotions with the given IDs.', 'surecart' ),
				),
				'page'         => array(
					'type'        => 'integer',
					'description' => __( 'Page number for pagination.', 'surecart' ),
					'default'     => 1,
				),
				'per_page'     => array(
					'type'        => 'integer',
					'description' => __( 'Number of promotions per page (max 100).', 'surecart' ),
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
				'success'    => array( 'type' => 'boolean' ),
				'promotions' => array(
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

		$args = array(
			'archived' => ! empty( $input['archived'] ),
		);

		// Array filter fields.
		$array_fields = array( 'coupon_ids', 'customer_ids', 'ids' );
		foreach ( $array_fields as $field ) {
			if ( ! empty( $input[ $field ] ) && is_array( $input[ $field ] ) ) {
				$args[ $field ] = array_map( 'sanitize_text_field', $input[ $field ] );
			}
		}

		$promotions = Promotion::where( $args )->paginate(
			array(
				'page'     => $page,
				'per_page' => $per_page,
			)
		);
		if ( is_wp_error( $promotions ) ) {
			return $promotions;
		}

		return $this->success(
			array(
				'promotions' => array_map( array( $this, 'model_to_array' ), $promotions->data ?? array() ),
				'pagination' => array(
					'count' => $promotions->pagination->count ?? 0,
					'page'  => $page,
					'limit' => $per_page,
				),
			)
		);
	}
}
