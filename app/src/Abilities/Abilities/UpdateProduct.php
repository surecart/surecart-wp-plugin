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
		return __( 'Update an existing SureCart product. Provide only the fields you want to change: name, description, or metadata.', 'surecart' );
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
	public function execute( array $input ): array {
		$id   = sanitize_text_field( $input['id'] );
		$data = array();

		if ( ! empty( $input['name'] ) ) {
			$data['name'] = sanitize_text_field( $input['name'] );
		}

		if ( ! empty( $input['description'] ) ) {
			$data['description'] = sanitize_textarea_field( $input['description'] );
		}

		if ( ! empty( $input['metadata'] ) && is_array( $input['metadata'] ) ) {
			$sanitized_meta = array();
			foreach ( $input['metadata'] as $key => $value ) {
				if ( ! is_string( $value ) && ! is_numeric( $value ) ) {
					return $this->error( __( 'Metadata values must be strings.', 'surecart' ) );
				}
				$sanitized_meta[ sanitize_text_field( $key ) ] = sanitize_text_field( (string) $value );
			}
			$data['metadata'] = $sanitized_meta;
		}

		if ( empty( $data ) ) {
			return $this->error( __( 'At least one field must be provided to update.', 'surecart' ) );
		}

		$product = ( new Product( $id ) )->update( $data );
		if ( is_wp_error( $product ) ) {
			return $this->error( $this->wp_error_to_message( $product ) );
		}

		return $this->success(
			array(
				'product' => $this->model_to_array( $product ),
			)
		);
	}
}
