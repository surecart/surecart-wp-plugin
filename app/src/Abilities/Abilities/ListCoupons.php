<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Coupon;

/**
 * List coupons with filters.
 */
class ListCoupons extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/list-coupons';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'List Coupons', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a paginated list of SureCart coupons. Supports filtering by search query and archived status. Returns coupon names, IDs, discount details, and usage limits.', 'surecart' );
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
		return 'Use this to browse or search coupons. To search by name, use the "query" parameter (not "search" or "name") — e.g. query="SUMMER". Set archived=true to include archived coupons. For full details on a single coupon, use get-coupon instead. Only known parameters are accepted: query, archived, page, per_page.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_coupons' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'query'    => array(
					'type'        => 'string',
					'description' => __( 'Search query to filter coupons by name.', 'surecart' ),
				),
				'archived' => array(
					'type'        => 'boolean',
					'description' => __( 'Whether to include archived coupons.', 'surecart' ),
					'default'     => false,
				),
				'ids'      => array(
					'type'        => 'array',
					'items'       => array( 'type' => 'string' ),
					'description' => __( 'Only return coupons with the given IDs.', 'surecart' ),
				),
				'page'     => array(
					'type'        => 'integer',
					'description' => __( 'Page number for pagination.', 'surecart' ),
					'default'     => 1,
				),
				'per_page' => array(
					'type'        => 'integer',
					'description' => __( 'Number of coupons per page (max 100).', 'surecart' ),
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
				'coupons'    => array(
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

		if ( ! empty( $input['query'] ) ) {
			$args['query'] = sanitize_text_field( $input['query'] );
		}

		if ( ! empty( $input['ids'] ) && is_array( $input['ids'] ) ) {
			$args['ids'] = array_map( 'sanitize_text_field', $input['ids'] );
		}

		$coupons = Coupon::where( $args )->paginate(
			array(
				'page'     => $page,
				'per_page' => $per_page,
			)
		);
		if ( is_wp_error( $coupons ) ) {
			return $coupons;
		}

		return $this->success(
			array(
				'coupons'    => array_map( array( $this, 'model_to_array' ), $coupons->data ?? array() ),
				'pagination' => array(
					'count' => $coupons->pagination->count ?? 0,
					'page'  => $page,
					'limit' => $per_page,
				),
			)
		);
	}
}
