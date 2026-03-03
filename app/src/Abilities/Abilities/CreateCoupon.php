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
				'duration'    => array(
					'type'        => 'string',
					'description' => __( 'Coupon duration: once, repeating, or forever.', 'surecart' ),
					'default'     => 'once',
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
		$data = array(
			'name'     => sanitize_text_field( $input['name'] ),
			'duration' => sanitize_text_field( $input['duration'] ?? 'once' ),
		);

		if ( ! empty( $input['percent_off'] ) ) {
			$data['percent_off'] = floatval( $input['percent_off'] );
		} elseif ( ! empty( $input['amount_off'] ) ) {
			$data['amount_off'] = absint( $input['amount_off'] );
			$data['currency']   = sanitize_text_field( $input['currency'] ?? 'usd' );
		}

		$coupon = Coupon::create( $data );
		if ( is_wp_error( $coupon ) ) {
			return $this->error( $coupon->get_error_message() );
		}

		return $this->success(
			array(
				'coupon' => $this->model_to_array( $coupon ),
			)
		);
	}
}
