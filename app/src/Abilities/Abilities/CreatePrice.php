<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Price;

/**
 * Create a new price for a product.
 */
class CreatePrice extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/create-price';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Create Price', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Create a new price for an existing SureCart product. Requires the product ID, amount in the smallest currency unit (e.g., cents for USD), and currency code. Supports one-time and recurring pricing.', 'surecart' );
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
		return 'Requires a valid product ID. The amount is in the smallest currency unit (e.g., 1000 = $10.00 USD). For recurring prices, set recurring_interval (day, week, month, year) and recurring_interval_count. Each call creates a new price — do not call multiple times for the same price.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'publish_sc_prices' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'product'                  => array(
					'type'        => 'string',
					'description' => __( 'The product ID to attach this price to.', 'surecart' ),
				),
				'amount'                   => array(
					'type'        => 'integer',
					'description' => __( 'Price amount in the smallest currency unit (e.g., cents).', 'surecart' ),
				),
				'currency'                 => array(
					'type'        => 'string',
					'description' => __( 'Three-letter ISO currency code (e.g., usd).', 'surecart' ),
				),
				'recurring_interval'       => array(
					'type'        => 'string',
					'description' => __( 'Billing interval for recurring prices.', 'surecart' ),
					'enum'        => array( 'day', 'week', 'month', 'year' ),
				),
				'recurring_interval_count' => array(
					'type'        => 'integer',
					'description' => __( 'Number of intervals between each billing cycle.', 'surecart' ),
				),
				'name'                     => array(
					'type'        => 'string',
					'description' => __( 'Display name for the price.', 'surecart' ),
				),
			),
			'required'   => array( 'product', 'amount', 'currency' ),
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
				'price'   => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param array $input The input data.
	 */
	public function execute( array $input ) {
		$amount = intval( $input['amount'] );
		if ( $amount <= 0 ) {
			return $this->error( 'invalid_amount', __( 'Amount must be greater than zero.', 'surecart' ) );
		}

		$data = array(
			'product'  => sanitize_text_field( $input['product'] ),
			'amount'   => $amount,
			'currency' => sanitize_text_field( $input['currency'] ),
		);

		if ( ! empty( $input['recurring_interval'] ) ) {
			$allowed_intervals = array( 'day', 'week', 'month', 'year' );
			$interval          = sanitize_text_field( $input['recurring_interval'] );
			if ( ! in_array( $interval, $allowed_intervals, true ) ) {
				return $this->error(
					'invalid_interval',
					/* translators: %s: comma-separated list of valid interval values */
					sprintf( __( 'Invalid recurring_interval. Allowed values: %s', 'surecart' ), implode( ', ', $allowed_intervals ) )
				);
			}
			$data['recurring_interval'] = $interval;
		}

		if ( ! empty( $input['recurring_interval_count'] ) ) {
			$data['recurring_interval_count'] = absint( $input['recurring_interval_count'] );
		}

		if ( ! empty( $input['name'] ) ) {
			$data['name'] = sanitize_text_field( $input['name'] );
		}

		$price = Price::create( $data );
		if ( is_wp_error( $price ) ) {
			return $price;
		}

		return $this->success(
			array(
				'price' => $this->model_to_array( $price ),
			)
		);
	}
}
