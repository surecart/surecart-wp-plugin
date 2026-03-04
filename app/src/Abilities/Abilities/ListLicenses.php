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
		return __( 'List SureCart licenses with optional filters for customer, product, purchase, revoked status, search query, and pagination.', 'surecart' );
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
					'description' => __( 'Filter by revoked status.', 'surecart' ),
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
		$args = array(
			'page'     => absint( $input['page'] ?? 1 ),
			'per_page' => min( absint( $input['per_page'] ?? 10 ), 100 ),
		);

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

		$licenses = License::where( $args )->paginate();
		if ( is_wp_error( $licenses ) ) {
			return $licenses;
		}

		return $this->success(
			array(
				'licenses'   => array_map( array( $this, 'model_to_array' ), $licenses->data ?? array() ),
				'pagination' => array(
					'count' => $licenses->pagination->count ?? 0,
					'page'  => $args['page'],
					'limit' => $args['per_page'],
				),
			)
		);
	}
}
