<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Product;

/**
 * Archive (soft-delete) a product.
 */
class ArchiveProduct extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/archive-product';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Archive Product', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Archive (soft-delete) a product, removing it from the storefront. The product data is preserved and can be restored.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'delete_sc_products' );
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
					'description' => __( 'The product ID to archive.', 'surecart' ),
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

		$product = ( new Product( $id ) )->update( array( 'archived' => true ) );
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
