<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Product;

/**
 * List products with filters.
 */
class ListProducts extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/list-products';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'List Products', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a paginated list of SureCart products. Supports filtering by search query and archived status. Returns product names, IDs, prices, and metadata. By default returns only active (non-archived) products, 10 per page.', 'surecart' );
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
		return 'Use this to browse or search the product catalog. To search by name, use the "query" parameter (not "search" or "name") — e.g. query="T-Shirt". Set archived=true to include soft-deleted products. Maximum 100 results per page. For full details on a single product, use get-product instead. Only known parameters are accepted: query, archived, page, per_page.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_products' );
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
					'description' => __( 'Search query to filter products by name.', 'surecart' ),
				),
				'archived' => array(
					'type'        => 'boolean',
					'description' => __( 'Whether to include archived products.', 'surecart' ),
					'default'     => false,
				),
				'page'     => array(
					'type'        => 'integer',
					'description' => __( 'Page number for pagination.', 'surecart' ),
					'default'     => 1,
				),
				'per_page' => array(
					'type'        => 'integer',
					'description' => __( 'Number of products per page (max 100).', 'surecart' ),
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
				'success'  => array( 'type' => 'boolean' ),
				'products' => array(
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

		$products = Product::where( $args )->paginate(
			array(
				'page'     => $page,
				'per_page' => $per_page,
			)
		);
		if ( is_wp_error( $products ) ) {
			return $products;
		}

		return $this->success(
			array(
				'products'   => array_map( array( $this, 'model_to_array' ), $products->data ?? array() ),
				'pagination' => array(
					'count' => $products->pagination->count ?? 0,
					'page'  => $page,
					'limit' => $per_page,
				),
			)
		);
	}
}
