<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Promotion;

/**
 * Update an existing promotion.
 */
class UpdatePromotion extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/update-promotion';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Update Promotion', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Update an existing SureCart promotion by ID. Supports changing the code, coupon, and customer association.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'edit_sc_promotions' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'id'       => array(
					'type'        => 'string',
					'description' => __( 'The promotion ID to update.', 'surecart' ),
				),
				'code'     => array(
					'type'        => 'string',
					'description' => __( 'The customer-facing promotion code. Must be unique across all promotions.', 'surecart' ),
				),
				'coupon'   => array(
					'type'        => 'string',
					'description' => __( 'The coupon ID to associate with this promotion.', 'surecart' ),
				),
				'customer' => array(
					'type'        => 'string',
					'description' => __( 'The customer ID to restrict this promotion to a specific customer.', 'surecart' ),
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
				'success'   => array( 'type' => 'boolean' ),
				'promotion' => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ): array {
		$id   = sanitize_text_field( $input['id'] );
		$data = array( 'id' => $id );

		// String fields.
		$string_fields = array( 'code', 'coupon', 'customer' );
		foreach ( $string_fields as $field ) {
			if ( isset( $input[ $field ] ) && '' !== $input[ $field ] ) {
				$data[ $field ] = sanitize_text_field( $input[ $field ] );
			}
		}

		$promotion = Promotion::update( $data );
		if ( is_wp_error( $promotion ) ) {
			return $this->wp_error( $promotion );
		}

		return $this->success(
			array(
				'promotion' => $this->model_to_array( $promotion ),
			)
		);
	}
}
