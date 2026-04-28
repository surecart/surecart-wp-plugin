<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Coupon;

/**
 * Update an existing coupon.
 */
class UpdateCoupon extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/update-coupon';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Update Coupon', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Update an existing SureCart coupon by its ID. Supports changing the name, discount amount or percentage, duration, and redemption limits. Only provided fields are updated.', 'surecart' );
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
		return 'Requires a valid coupon ID. Only include the fields you want to change — omitted fields are not modified. Changes affect all future uses of the coupon but not existing redemptions.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'edit_sc_coupons' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'id'                           => array(
					'type'        => 'string',
					'description' => __( 'The coupon ID to update.', 'surecart' ),
				),
				'name'                         => array(
					'type'        => 'string',
					'description' => __( 'Coupon name displayed to customers.', 'surecart' ),
				),
				'percent_off'                  => array(
					'type'        => 'number',
					'description' => __( 'Percentage discount (e.g., 10 for 10% off). Use this or amount_off, not both.', 'surecart' ),
				),
				'amount_off'                   => array(
					'type'        => 'integer',
					'description' => __( 'Fixed amount discount in smallest currency unit (e.g., cents). Use this or percent_off, not both.', 'surecart' ),
				),
				'duration'                     => array(
					'type'        => 'string',
					'description' => __( 'Coupon duration: once, repeating, or forever.', 'surecart' ),
				),
				'duration_in_months'           => array(
					'type'        => 'integer',
					'description' => __( 'Number of months the coupon applies when duration is repeating.', 'surecart' ),
				),
				'max_redemptions'              => array(
					'type'        => 'integer',
					'description' => __( 'Maximum total redemptions across all customers.', 'surecart' ),
				),
				'max_redemptions_per_customer' => array(
					'type'        => 'integer',
					'description' => __( 'Maximum redemptions per individual customer.', 'surecart' ),
				),
				'min_subtotal_amount'          => array(
					'type'        => 'integer',
					'description' => __( 'Minimum checkout subtotal required in smallest currency unit.', 'surecart' ),
				),
				'max_subtotal_amount'          => array(
					'type'        => 'integer',
					'description' => __( 'Maximum checkout subtotal allowed in smallest currency unit.', 'surecart' ),
				),
				'product_ids'                  => array(
					'type'        => 'array',
					'items'       => array( 'type' => 'string' ),
					'description' => __( 'Product IDs this coupon applies to. Empty array means all products.', 'surecart' ),
				),
				'redeem_by'                    => array(
					'type'        => 'integer',
					'description' => __( 'Unix timestamp after which the coupon expires.', 'surecart' ),
				),
				'archived'                     => array(
					'type'        => 'boolean',
					'description' => __( 'Whether the coupon is archived.', 'surecart' ),
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
				'coupon'  => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ) {
		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'A coupon ID is required.', 'surecart' ) );
		}

		$data = array( 'id' => $id );

		// String fields.
		$string_fields = array( 'name', 'duration' );
		foreach ( $string_fields as $field ) {
			if ( isset( $input[ $field ] ) && '' !== $input[ $field ] ) {
				$data[ $field ] = sanitize_text_field( $input[ $field ] );
			}
		}

		// Numeric fields.
		if ( isset( $input['percent_off'] ) ) {
			$data['percent_off'] = floatval( $input['percent_off'] );
		}

		$int_fields = array( 'amount_off', 'duration_in_months', 'max_redemptions', 'max_redemptions_per_customer', 'min_subtotal_amount', 'max_subtotal_amount', 'redeem_by' );
		foreach ( $int_fields as $field ) {
			if ( isset( $input[ $field ] ) ) {
				$data[ $field ] = absint( $input[ $field ] );
			}
		}

		// Boolean fields.
		if ( isset( $input['archived'] ) ) {
			$data['archived'] = (bool) $input['archived'];
		}

		// Array fields.
		if ( isset( $input['product_ids'] ) && is_array( $input['product_ids'] ) ) {
			$data['product_ids'] = array_map( 'sanitize_text_field', $input['product_ids'] );
		}

		$coupon = Coupon::update( $data );
		if ( is_wp_error( $coupon ) ) {
			return $coupon;
		}

		return $this->success(
			array(
				'coupon' => $this->model_to_array( $coupon ),
			)
		);
	}
}
