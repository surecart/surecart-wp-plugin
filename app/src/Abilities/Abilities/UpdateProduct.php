<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Product;

/**
 * Update an existing product.
 */
class UpdateProduct extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/update-product';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Update Product', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Update an existing SureCart product by its ID. Supports changing name, description, metadata, and other product attributes. Only provided fields are updated; omitted fields remain unchanged.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_annotations(): array {
		return array(
			'readonly'    => false,
			'destructive' => false,
			'idempotent'  => true,
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_instructions(): string {
		return 'Requires a valid product ID. Only include the fields you want to change — omitted fields are not modified. To archive a product, use archive-product instead.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'edit_sc_products' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'id'          => array(
					'type'        => 'string',
					'description' => __( 'The product ID to update.', 'surecart' ),
				),
				'name'        => array(
					'type'        => 'string',
					'description' => __( 'New product name.', 'surecart' ),
				),
				'description' => array(
					'type'        => 'string',
					'description' => __( 'New product description.', 'surecart' ),
				),
				'metadata'    => array(
					'type'                 => 'object',
					'description'          => __( 'Key-value metadata to set on the product.', 'surecart' ),
					'additionalProperties' => array( 'type' => 'string' ),
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
	 *
	 * @param array $input The input data.
	 */
	public function execute( array $input ) {
		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'A product ID is required.', 'surecart' ) );
		}

		$data = array();

		if ( ! empty( $input['name'] ) ) {
			$data['name'] = sanitize_text_field( $input['name'] );
		}

		if ( ! empty( $input['description'] ) ) {
			$data['description'] = wp_kses_post( $input['description'] );
		}

		if ( ! empty( $input['metadata'] ) && is_array( $input['metadata'] ) ) {
			$sanitized_meta = array();
			foreach ( $input['metadata'] as $key => $value ) {
				if ( ! is_string( $value ) && ! is_numeric( $value ) ) {
					return $this->error( 'invalid_metadata', __( 'Metadata values must be strings.', 'surecart' ) );
				}
				$sanitized_meta[ sanitize_text_field( $key ) ] = sanitize_text_field( (string) $value );
			}
			$data['metadata'] = $sanitized_meta;
		}

		if ( empty( $data ) ) {
			return $this->error( 'missing_fields', __( 'At least one field must be provided to update.', 'surecart' ) );
		}

		$data['id'] = $id;
		$product    = Product::update( $data );
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
