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
		return __( 'Create a new price for an existing SureCart product. Requires the product ID and currency code. For fixed prices, an amount in the smallest currency unit (e.g., cents for USD) is required. For ad-hoc prices (customer or merchant supplies the amount at checkout/invoice time), set ad_hoc to true; amount becomes optional and is treated as a default. Supports one-time and recurring pricing.', 'surecart' );
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
		return 'Requires a valid product ID and currency. The amount is in the smallest currency unit (e.g., 1000 = $10.00 USD). For fixed prices, amount is required and must be greater than zero. For ad-hoc prices (where the amount is supplied at invoice/checkout time — e.g., custom invoicing), pass ad_hoc=true; amount then becomes optional and, if provided, is used as a suggested default. Even though amount is optional for ad-hoc, providing a sensible default within [ad_hoc_min_amount, ad_hoc_max_amount] is recommended — it pre-fills the buy form / invoice with a starting value instead of leaving it blank. ad_hoc_min_amount and ad_hoc_max_amount (both in smallest currency unit) optionally constrain the allowed range. For recurring prices, set recurring_interval (day, week, month, year) and recurring_interval_count. Each call creates a new price — do not call multiple times for the same price.';
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
					'description' => __( 'Price amount in the smallest currency unit (e.g., cents). Required when ad_hoc is false or omitted. When ad_hoc is true, this is optional and acts as a suggested default — providing one within [ad_hoc_min_amount, ad_hoc_max_amount] is recommended so the buy form / invoice pre-fills with a starting value instead of being blank.', 'surecart' ),
				),
				'currency'                 => array(
					'type'        => 'string',
					'description' => __( 'Three-letter ISO currency code (e.g., usd).', 'surecart' ),
				),
				'ad_hoc'                   => array(
					'type'        => 'boolean',
					'description' => __( 'When true, the amount is supplied at invoice/checkout time instead of being fixed. Useful for custom invoicing.', 'surecart' ),
				),
				'ad_hoc_min_amount'        => array(
					'type'        => 'integer',
					'description' => __( 'Optional minimum allowed amount (smallest currency unit) for ad-hoc prices. Only applicable when ad_hoc is true; ignored otherwise.', 'surecart' ),
				),
				'ad_hoc_max_amount'        => array(
					'type'        => 'integer',
					'description' => __( 'Optional maximum allowed amount (smallest currency unit) for ad-hoc prices. Only applicable when ad_hoc is true; ignored otherwise.', 'surecart' ),
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
			'required'   => array( 'product', 'currency' ),
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
		$is_ad_hoc  = ! empty( $input['ad_hoc'] );
		$has_amount = isset( $input['amount'] );
		$amount     = $has_amount ? intval( $input['amount'] ) : null;

		// Fixed prices: amount is required and must be positive.
		// Ad-hoc prices: amount is optional; if provided, it acts as a suggested default and may be zero (no default) but not negative.
		if ( ! $is_ad_hoc ) {
			if ( ! $has_amount ) {
				return $this->error( 'missing_amount', __( 'Amount is required for fixed prices.', 'surecart' ) );
			}
			if ( $amount <= 0 ) {
				return $this->error( 'invalid_amount', __( 'Amount must be greater than zero.', 'surecart' ) );
			}
		} elseif ( $has_amount && $amount < 0 ) {
			return $this->error( 'invalid_amount', __( 'Amount must be zero or greater.', 'surecart' ) );
		}

		$data = array(
			'product'  => sanitize_text_field( $input['product'] ),
			'currency' => sanitize_text_field( $input['currency'] ),
		);

		if ( $has_amount ) {
			$data['amount'] = $amount;
		}

		if ( $is_ad_hoc ) {
			$data['ad_hoc'] = true;

			if ( isset( $input['ad_hoc_min_amount'] ) ) {
				$ad_hoc_min = intval( $input['ad_hoc_min_amount'] );
				if ( $ad_hoc_min < 0 ) {
					return $this->error( 'invalid_ad_hoc_min_amount', __( 'ad_hoc_min_amount must be zero or greater.', 'surecart' ) );
				}
				$data['ad_hoc_min_amount'] = $ad_hoc_min;
			}
			if ( isset( $input['ad_hoc_max_amount'] ) ) {
				$ad_hoc_max = intval( $input['ad_hoc_max_amount'] );
				if ( $ad_hoc_max < 0 ) {
					return $this->error( 'invalid_ad_hoc_max_amount', __( 'ad_hoc_max_amount must be zero or greater.', 'surecart' ) );
				}
				$data['ad_hoc_max_amount'] = $ad_hoc_max;
			}

			if ( isset( $data['ad_hoc_min_amount'], $data['ad_hoc_max_amount'] ) && $data['ad_hoc_min_amount'] > $data['ad_hoc_max_amount'] ) {
				return $this->error( 'invalid_ad_hoc_range', __( 'ad_hoc_min_amount cannot be greater than ad_hoc_max_amount.', 'surecart' ) );
			}

			// The SureCart API rejects ad-hoc prices with a missing amount ("Amount can't be blank"),
			// but the schema documents amount as optional for ad-hoc. Default to 0 so the documented
			// contract holds — 0 is a valid "no suggested default" sentinel for ad-hoc.
			if ( ! $has_amount ) {
				$data['amount'] = 0;
				$has_amount     = true;
				$amount         = 0;
			}

			// The default amount, if provided, must fall within the configured ad-hoc range.
			// Neither the API nor the previous PHP layer enforced this, allowing inconsistent
			// records (e.g. amount: 1000 with min: 5000) to be persisted.
			if ( $has_amount && isset( $data['ad_hoc_min_amount'] ) && $amount > 0 && $amount < $data['ad_hoc_min_amount'] ) {
				return $this->error( 'invalid_amount', __( 'Amount cannot be less than ad_hoc_min_amount.', 'surecart' ) );
			}
			if ( $has_amount && isset( $data['ad_hoc_max_amount'] ) && $amount > $data['ad_hoc_max_amount'] ) {
				return $this->error( 'invalid_amount', __( 'Amount cannot be greater than ad_hoc_max_amount.', 'surecart' ) );
			}
		}

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
