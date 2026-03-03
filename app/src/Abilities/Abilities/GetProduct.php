<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Product;

/**
 * Get a single product with prices and variants.
 */
class GetProduct extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-product';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get Product', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Get a single SureCart product by ID, including its prices and variants.', 'surecart' );
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
				'id' => array(
					'type'        => 'string',
					'description' => __( 'The product ID.', 'surecart' ),
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
	public function execute( array $input ): array {
		$product = Product::with( array( 'prices', 'variants' ) )->find( sanitize_text_field( $input['id'] ) );
		if ( is_wp_error( $product ) ) {
			return $this->error( $product->get_error_message() );
		}

		return $this->success(
			array(
				'product' => $this->model_to_array( $product ),
			)
		);
	}
}
