<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\AbandonedCheckout;

/**
 * Get a single abandoned checkout with its checkout, customer, and recovery details.
 */
class GetAbandonedCheckout extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-abandoned-checkout';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get Abandoned Checkout', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a single SureCart abandoned checkout by its ID, including its checkout, line items, customer, promotion, and recovered checkout (if any). Returns the full abandoned checkout object with related data expanded.', 'surecart' );
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
		return 'Use this when you need full details about a specific abandoned checkout, including the underlying checkout, its line items, the customer, the auto-generated promotion, and the recovered checkout (when present). For browsing multiple abandoned checkouts, use list-abandoned-checkouts instead.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_checkouts' );
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
					'description' => __( 'The abandoned checkout ID.', 'surecart' ),
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
				'success'            => array( 'type' => 'boolean' ),
				'abandoned_checkout' => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ) {
		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'An abandoned checkout ID is required.', 'surecart' ) );
		}

		$abandoned = AbandonedCheckout::with(
			array(
				'recovered_checkout',
				'checkout',
				'customer',
				'checkout.line_items',
				'promotion',
				'promotion.coupon',
			)
		)->find( $id );

		if ( is_wp_error( $abandoned ) ) {
			return $abandoned;
		}

		return $this->success(
			array(
				'abandoned_checkout' => $this->model_to_array( $abandoned ),
			)
		);
	}
}
