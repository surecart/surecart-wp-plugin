<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Product;

/**
 * Duplicate an existing product.
 */
class DuplicateProduct extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/duplicate-product';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Duplicate Product', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Duplicate an existing SureCart product by its ID, creating a new product with all prices, variants, variant options, and settings copied. The duplicated product is created in active state with a modified name.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_annotations(): array {
		return array(
			'readonly'    => false,
			'destructive' => false,
			'idempotent'  => false,
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_instructions(): string {
		return 'Requires the ID of the product to duplicate. The new product will have all prices, variants, and settings copied. Useful for creating similar products quickly.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'publish_sc_products' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'id' => array(
					'type'        => 'string',
					'description' => __( 'The product ID to duplicate.', 'surecart' ),
				),
			),
			'required'   => array( 'id' ),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'success' => array( 'type' => 'boolean' ),
				'product' => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ) {
		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'A product ID is required.', 'surecart' ) );
		}

		$product = Product::duplicate( $id );
		if ( is_wp_error( $product ) ) {
			return $product;
		}

		return $this->success(
			array(
				'product' => $this->model_to_array( $product ),
			)
		);
	}
}
