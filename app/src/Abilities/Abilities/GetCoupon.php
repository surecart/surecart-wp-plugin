<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Coupon;

/**
 * Get a single coupon by ID.
 */
class GetCoupon extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-coupon';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get Coupon', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a single SureCart coupon by its ID, including its associated promotions. Returns the full coupon object with discount details and usage limits.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_annotations(): array {
		return array(
			'readonly'    => true,
			'destructive' => false,
			'idempotent'  => true,
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_instructions(): string {
		return 'Use this when you need full details about a specific coupon. For browsing multiple coupons, use list-coupons instead.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_coupons' );
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
					'description' => __( 'The coupon ID.', 'surecart' ),
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

		$coupon = Coupon::with( array( 'promotions' ) )->find( $id );
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
