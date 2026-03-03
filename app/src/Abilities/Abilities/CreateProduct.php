<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Product;

/**
 * Create a new product with prices.
 */
class CreateProduct extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/create-product';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Create Product', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Create a new SureCart product with a name, description, and optional price.', 'surecart' );
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
				'name'        => array(
					'type'        => 'string',
					'description' => __( 'Product name.', 'surecart' ),
				),
				'description' => array(
					'type'        => 'string',
					'description' => __( 'Product description.', 'surecart' ),
				),
				'price'       => array(
					'type'        => 'integer',
					'description' => __( 'Price amount in the smallest currency unit (e.g., cents).', 'surecart' ),
				),
				'currency'    => array(
					'type'        => 'string',
					'description' => __( 'Three-letter ISO currency code (e.g., usd).', 'surecart' ),
					'default'     => 'usd',
				),
				'recurring'   => array(
					'type'        => 'boolean',
					'description' => __( 'Whether this is a recurring/subscription product.', 'surecart' ),
					'default'     => false,
				),
			),
			'required'   => array( 'name' ),
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
		$data = array(
			'name' => sanitize_text_field( $input['name'] ),
		);

		if ( ! empty( $input['description'] ) ) {
			$data['description'] = sanitize_textarea_field( $input['description'] );
		}

		if ( ! empty( $input['price'] ) ) {
			$price_data = array(
				'amount'   => absint( $input['price'] ),
				'currency' => sanitize_text_field( $input['currency'] ?? 'usd' ),
			);

			if ( ! empty( $input['recurring'] ) ) {
				$price_data['recurring_interval']       = 'month';
				$price_data['recurring_interval_count'] = 1;
			}

			$data['prices'] = array( $price_data );
		}

		$product = Product::create( $data );
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
