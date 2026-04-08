<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Price;

/**
 * List prices with filters.
 */
class ListPrices extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/list-prices';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'List Prices', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a paginated list of SureCart prices, optionally filtered by product ID. Returns price amounts, currencies, recurring intervals, and associated product IDs.', 'surecart' );
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
		return 'Use this to view pricing for one or more products. Filter by product_ids (array of product IDs) to get prices for specific products. For full product details with prices included, use get-product instead. Only known parameters are accepted: product_ids, page, per_page.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_prices' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'product_ids' => array(
					'type'        => 'array',
					'items'       => array( 'type' => 'string' ),
					'description' => __( 'Filter by product IDs.', 'surecart' ),
				),
				'archived'    => array(
					'type'        => 'boolean',
					'description' => __( 'Whether to include archived prices.', 'surecart' ),
					'default'     => false,
				),
				'page'        => array(
					'type'        => 'integer',
					'description' => __( 'Page number for pagination.', 'surecart' ),
					'default'     => 1,
				),
				'per_page'    => array(
					'type'        => 'integer',
					'description' => __( 'Number of prices per page (max 100).', 'surecart' ),
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
				'prices'     => array(
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

		if ( ! empty( $input['product_ids'] ) && is_array( $input['product_ids'] ) ) {
			$args['product_ids'] = array_map( 'sanitize_text_field', $input['product_ids'] );
		}

		$prices = Price::where( $args )->paginate(
			array(
				'page'     => $page,
				'per_page' => $per_page,
			)
		);
		if ( is_wp_error( $prices ) ) {
			return $prices;
		}

		return $this->success(
			array(
				'prices'     => array_map( array( $this, 'model_to_array' ), $prices->data ?? array() ),
				'pagination' => array(
					'count' => $prices->pagination->count ?? 0,
					'page'  => $page,
					'limit' => $per_page,
				),
			)
		);
	}
}
