<?php

namespace SureCart\Models;

use SureCart\Models\Product;
use SureCart\Support\Currency;

/**
 * Price model
 */
class Price extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'prices';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'price';

	/**
	 * Is this cachable?
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when products are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'products_updated_at';

	/**
	 * Set the product attribute
	 *
	 * @param array $attributes Attributes to update.
	 *
	 * @return $this|false
	 */
	protected function update( $attributes = array() ) {
		// update parent.
		$updated = parent::update( $attributes );

		// sync the product.
		$this->sync();

		// return.
		return $updated;
	}

	/**
	 * Update a model
	 *
	 * @param string $id ID to delete.
	 *
	 * @return $this|false
	 */
	protected function delete( $id = '' ) {
		// find price as we need the product id.
		$this->find( $id );

		// update parent.
		$response = parent::delete( $id );

		// sync product.
		$this->sync( [ 'refetch' => true ] );

		// return.
		return $response;
	}

	/**
	 * Sync the product
	 *
	 * @param array $args Arguments.
	 *                  - refetch: boolean (default: false) - refetch the product.
	 *                  - cached: boolean (default: false) - use the cached product.
	 *
	 * @return void
	 */
	protected function sync( $args = [] ) {
		$args = wp_parse_args(
			$args,
			array(
				'refetch' => false,
				'cached'  => false,
			)
		);

		// if the product is already attached, and syncable, use that. Otherwise, find it.
		$product = ! empty( $this->product ) && $this->product->has_syncable_expands && ! $args['refetch'] ? $this->product : Product::withSyncableExpands()->where( array( 'cached' => $args['cached'] ) )->find( $this->product_id );

		$product->sync();
	}

	/**
	 * Get the display amount attribute
	 *
	 * @return string
	 */
	public function getDisplayAmountAttribute() {
		if ( $this->ad_hoc ) {
			return esc_html__( 'Custom Amount', 'surecart' );
		}
		return empty( $this->amount ) ? '' : Currency::format( $this->amount, $this->currency );
	}

	/**
	 * The the scratch display amount attribute.
	 *
	 * @return string
	 */
	public function getScratchDisplayAmountAttribute() {
		return empty( $this->scratch_amount ) ? '' : Currency::format( $this->scratch_amount, $this->currency );
	}

	/**
	 * Get the display price attribute
	 *
	 * @return string
	 */
	public function getIsOnSaleAttribute() {
		if ( $this->ad_hoc ) {
			return false;
		}
		return empty( $this->scratch_amount ) ? false : $this->scratch_amount > $this->amount;
	}

	/**
	 * Get the trial display text attribute
	 *
	 * @return string
	 */
	public function getTrialTextAttribute() {
		return $this->trial_duration_days ? sprintf(
			_n(
				'Starting in %s day',
				'Starting in %s days',
				$this->trial_duration_days,
				'surecart'
			),
			$this->trial_duration_days
		)
		: null;
	}

	/**
	 * Get the setup fee text attribute
	 */
	public function getSetupFeeTextAttribute() {
		if ( empty( $this->setup_fee_enabled ) || empty( $this->setup_fee_amount ) ) {
			return '';
		}
		return sprintf(
			__( '%1$1s %2$2s', 'surecart' ),
			Currency::format( $this->setup_fee_amount, $this->currency ),
			$this->setup_fee_name ?? __( 'Setup Fee', 'surecart' )
		);
	}

	/**
	 * Get the recurring text attribute
	 *
	 * @return string
	 */
	public function getPaymentsTextAttribute() {
		return empty( $this->recurring_period_count ) || $this->recurring_period_count > 1 ? sprintf(
			_n(
				'%d payment',
				'%d payments',
				$this->recurring_period_count,
				'your_text_domain'
			),
			$this->recurring_period_count
		) : '';
	}

	/**
	 * Get the interval text attribute
	 *
	 * @return string
	 */
	public function getIntervalTextAttribute( $intervals = [] ) {
		$intervals = wp_parse_args(
			$intervals,
			[
				'day'   => __( 'day', 'surecart' ),
				'week'  => __( 'week', 'surecart' ),
				'month' => __( 'month', 'surecart' ),
				'year'  => __( 'year', 'surecart' ),
			]
		);

		if ( empty( $intervals[ $this->recurring_interval ] ) ) {
			return '';
		}

		return sprintf(
			_n( '/ %1s', '/ %1$2d %2$1s', $this->recurring_interval_count, 'surecart' ),
			$intervals[ $this->recurring_interval ],
			(int) $this->recurring_interval_count,
		);
	}

	/**
	 * Get the short interval text attribute
	 *
	 * @return string
	 */
	public function getShortIntervalTextAttribute() {
		return $this->getIntervalTextAttribute(
			[
				'day'   => __( 'day', 'surecart' ),
				'week'  => __( 'wk', 'surecart' ),
				'month' => __( 'mo', 'surecart' ),
				'year'  => __( 'yr', 'surecart' ),
			]
		);
	}

	/**
	 * Is this a zero decimal currency price?
	 *
	 * @return boolean
	 */
	public function getIsZeroDecimalAttribute() {
		return Currency::isZeroDecimal( $this->currency );
	}

	/**
	 * Get the currency symbol attribute
	 *
	 * @return string
	 */
	public function getCurrencySymbolAttribute() {
		return html_entity_decode( Currency::getCurrencySymbol( $this->currency ) );
	}
}
