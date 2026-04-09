<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\License;

/**
 * List licenses.
 */
class ListLicenses extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/list-licenses';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'List Licenses', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a paginated list of SureCart licenses. Supports filtering by customer, product, purchase, and revoked status. Returns license keys, IDs, activation counts, and statuses.', 'surecart' );
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
		return 'Use this to browse or filter licenses. To search, use the "query" parameter (not "search"). Filter by customer, product, or purchase. Set revoked=true to include revoked licenses. For full details on a single license, use get-license instead. Only known parameters are accepted: query, customer, product, purchase, revoked, page, per_page.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_licenses' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'customer_id' => array(
					'type'        => 'string',
					'description' => __( 'Filter by customer ID.', 'surecart' ),
				),
				'product_id'  => array(
					'type'        => 'string',
					'description' => __( 'Filter by product ID.', 'surecart' ),
				),
				'purchase_id' => array(
					'type'        => 'string',
					'description' => __( 'Filter by purchase ID.', 'surecart' ),
				),
				'revoked'     => array(
					'type'        => 'boolean',
					'description' => __( 'Set to true to show only revoked licenses, or false for active licenses. This is a boolean filter, not a string status field.', 'surecart' ),
				),
				'query'       => array(
					'type'        => 'string',
					'description' => __( 'Search query for full text search.', 'surecart' ),
				),
				'page'        => array(
					'type'        => 'integer',
					'description' => __( 'Page number for pagination.', 'surecart' ),
					'default'     => 1,
				),
				'per_page'    => array(
					'type'        => 'integer',
					'description' => __( 'Number of licenses per page (max 100).', 'surecart' ),
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
				'licenses'   => array(
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

		if ( ! empty( $input['customer_id'] ) ) {
			$args['customer_ids'] = array( sanitize_text_field( $input['customer_id'] ) );
		}

		if ( ! empty( $input['product_id'] ) ) {
			$args['product_ids'] = array( sanitize_text_field( $input['product_id'] ) );
		}

		if ( ! empty( $input['purchase_id'] ) ) {
			$args['purchase_ids'] = array( sanitize_text_field( $input['purchase_id'] ) );
		}

		if ( isset( $input['revoked'] ) ) {
			$args['revoked'] = (bool) $input['revoked'];
		}

		if ( ! empty( $input['query'] ) ) {
			$args['query'] = sanitize_text_field( $input['query'] );
		}

		$licenses = License::where( $args )->paginate(
			array(
				'page'     => $page,
				'per_page' => $per_page,
			)
		);
		if ( is_wp_error( $licenses ) ) {
			return $licenses;
		}

		return $this->success(
			array(
				'licenses'   => array_map( array( $this, 'model_to_array' ), $licenses->data ?? array() ),
				'pagination' => array(
					'count' => $licenses->pagination->count ?? 0,
					'page'  => $page,
					'limit' => $per_page,
				),
			)
		);
	}
}
