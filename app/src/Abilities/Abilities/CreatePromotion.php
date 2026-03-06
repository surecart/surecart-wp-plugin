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
		return __( 'Create a new SureCart promotion code linked to an existing coupon. Promotions are the customer-facing codes that apply a coupon discount at checkout. Optionally restrict to a specific customer.', 'surecart' );
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
		return 'Requires a valid coupon ID. The code field is the customer-facing promotion code entered at checkout. Optionally set a customer ID to restrict the promotion to a single customer. Each call creates a new promotion.';
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
