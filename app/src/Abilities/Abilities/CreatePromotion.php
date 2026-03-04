<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Promotion;

/**
 * Create a new promotion.
 */
class CreatePromotion extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/create-promotion';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Create Promotion', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Create a new SureCart promotion code linked to a coupon. The code is what customers enter at checkout.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'publish_sc_promotions' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'code'     => array(
					'type'        => 'string',
					'description' => __( 'The customer-facing promotion code. Must be unique. If omitted, one is auto-generated.', 'surecart' ),
				),
				'coupon'   => array(
					'type'        => 'string',
					'description' => __( 'The coupon ID to attach to this promotion.', 'surecart' ),
				),
				'customer' => array(
					'type'        => 'string',
					'description' => __( 'Optional customer ID to restrict this promotion to a specific customer.', 'surecart' ),
				),
			),
			'required'   => array( 'coupon' ),
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
	public function execute( array $input ) {
		$data = array(
			'coupon' => sanitize_text_field( $input['coupon'] ),
		);

		// Optional string fields.
		$string_fields = array( 'code', 'customer' );
		foreach ( $string_fields as $field ) {
			if ( ! empty( $input[ $field ] ) ) {
				$data[ $field ] = sanitize_text_field( $input[ $field ] );
			}
		}

		$promotion = Promotion::create( $data );
		if ( is_wp_error( $promotion ) ) {
			return $promotion;
		}

		return $this->success(
			array(
				'promotion' => $this->model_to_array( $promotion ),
			)
		);
	}
}
