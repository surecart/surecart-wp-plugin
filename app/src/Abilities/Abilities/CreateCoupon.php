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
		return __( 'Create a new SureCart coupon with a discount amount or percentage.', 'surecart' );
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
				'name'        => array(
					'type'        => 'string',
					'description' => __( 'Coupon name/code.', 'surecart' ),
				),
				'percent_off' => array(
					'type'        => 'number',
					'description' => __( 'Percentage discount (e.g., 10 for 10% off). Use this or amount_off, not both.', 'surecart' ),
				),
				'amount_off'  => array(
					'type'        => 'integer',
					'description' => __( 'Fixed amount discount in smallest currency unit (e.g., cents). Use this or percent_off, not both.', 'surecart' ),
				),
				'currency'    => array(
					'type'        => 'string',
					'description' => __( 'Three-letter ISO currency code for amount_off (e.g., usd).', 'surecart' ),
					'default'     => 'usd',
				),
				'duration'           => array(
					'type'        => 'string',
					'description' => __( 'Coupon duration: once, repeating, or forever.', 'surecart' ),
					'enum'        => array( 'once', 'repeating', 'forever' ),
					'default'     => 'once',
				),
				'duration_in_months' => array(
					'type'        => 'integer',
					'description' => __( 'Number of months the coupon applies. Required when duration is "repeating".', 'surecart' ),
				),
				'max_redemptions'    => array(
					'type'        => 'integer',
					'description' => __( 'Maximum total number of times this coupon can be redeemed.', 'surecart' ),
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
	public function execute( array $input ): array {
		$allowed_durations = array( 'once', 'repeating', 'forever' );
		$duration          = sanitize_text_field( $input['duration'] ?? 'once' );
		if ( ! in_array( $duration, $allowed_durations, true ) ) {
			return $this->error(
				/* translators: %s: comma-separated list of valid duration values */
				sprintf( __( 'Invalid duration. Allowed values: %s', 'surecart' ), implode( ', ', $allowed_durations ) )
			);
		}

		$data = array(
			'name'     => sanitize_text_field( $input['name'] ),
			'duration' => $duration,
		);

		if ( empty( $input['percent_off'] ) && empty( $input['amount_off'] ) ) {
			return $this->error( __( 'Either percent_off or amount_off must be provided.', 'surecart' ) );
		}

		if ( ! empty( $input['percent_off'] ) ) {
			$data['percent_off'] = floatval( $input['percent_off'] );
		} elseif ( ! empty( $input['amount_off'] ) ) {
			$data['amount_off'] = absint( $input['amount_off'] );
			$data['currency']   = sanitize_text_field( $input['currency'] ?? 'usd' );
		}

		if ( ! empty( $input['duration_in_months'] ) ) {
			$data['duration_in_months'] = absint( $input['duration_in_months'] );
		}

		if ( ! empty( $input['max_redemptions'] ) ) {
			$data['max_redemptions'] = absint( $input['max_redemptions'] );
		}

		$coupon = Coupon::create( $data );
		if ( is_wp_error( $coupon ) ) {
			return $this->error( $this->wp_error_to_message( $coupon ) );
		}

		return $this->success(
			array(
				'coupon' => $this->model_to_array( $coupon ),
			)
		);
	}
}
