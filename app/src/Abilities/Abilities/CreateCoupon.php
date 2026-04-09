<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Coupon;

/**
 * Create a new coupon/discount.
 */
class CreateCoupon extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/create-coupon';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Create Coupon', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Create a new SureCart coupon with a discount amount or percentage, duration, and optional redemption limits. Coupons define the discount logic and can be linked to one or more promotion codes.', 'surecart' );
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
		return 'Set either amount_off (in smallest currency unit) or percent_off (0-100), not both. Duration can be once, repeating, or forever. For repeating, also set duration_in_months. Each call creates a new coupon.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'publish_sc_coupons' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
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
				'currency'                     => array(
					'type'        => 'string',
					'description' => __( 'Three-letter ISO currency code for amount_off (e.g., usd).', 'surecart' ),
					'default'     => 'usd',
				),
				'duration'                     => array(
					'type'        => 'string',
					'description' => __( 'Coupon duration: once, repeating, or forever.', 'surecart' ),
					'enum'        => array( 'once', 'repeating', 'forever' ),
					'default'     => 'once',
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
					'description' => __( 'Product IDs this coupon applies to. Empty means all products.', 'surecart' ),
				),
				'redeem_by'                    => array(
					'type'        => 'integer',
					'description' => __( 'Unix timestamp after which the coupon expires.', 'surecart' ),
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
				'coupon'  => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ) {
		$allowed_durations = array( 'once', 'repeating', 'forever' );
		$duration          = sanitize_text_field( $input['duration'] ?? 'once' );
		if ( ! in_array( $duration, $allowed_durations, true ) ) {
			return $this->error(
				'invalid_duration',
				/* translators: %s: comma-separated list of valid duration values */
				sprintf( __( 'Invalid duration. Allowed values: %s', 'surecart' ), implode( ', ', $allowed_durations ) )
			);
		}

		$data = array(
			'name'     => sanitize_text_field( $input['name'] ),
			'duration' => $duration,
		);

		if ( ! empty( $input['percent_off'] ) && ! empty( $input['amount_off'] ) ) {
			return $this->error( 'invalid_input', __( 'You cannot set both percent_off and amount_off. Please use one or the other.', 'surecart' ) );
		}

		if ( ! empty( $input['percent_off'] ) ) {
			$data['percent_off'] = floatval( $input['percent_off'] );
		} elseif ( ! empty( $input['amount_off'] ) ) {
			$data['amount_off'] = absint( $input['amount_off'] );
			$data['currency']   = sanitize_text_field( $input['currency'] ?? 'usd' );
		}

		// Optional integer fields.
		$int_fields = array( 'duration_in_months', 'max_redemptions', 'max_redemptions_per_customer', 'min_subtotal_amount', 'max_subtotal_amount', 'redeem_by' );
		foreach ( $int_fields as $field ) {
			if ( isset( $input[ $field ] ) ) {
				$data[ $field ] = absint( $input[ $field ] );
			}
		}

		// Product restrictions.
		if ( isset( $input['product_ids'] ) && is_array( $input['product_ids'] ) ) {
			$data['product_ids'] = array_map( 'sanitize_text_field', $input['product_ids'] );
		}

		$coupon = Coupon::create( $data );
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
