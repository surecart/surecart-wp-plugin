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
	 * Set the WP Attachment based on the saved id
	 *
	 * @param object $meta Meta value.
	 *
	 * @return void
	 */
	public function filterMetaData( $meta_data ) {
		// get attachment source if we have an id.
		if ( ! empty( $meta_data->wp_attachment_id ) ) {
			$attachment = wp_get_attachment_image_src( $meta_data->wp_attachment_id );

			if ( ! empty( $attachment[0] ) ) {
				$meta_data->wp_attachment_src = $attachment[0];
			}
		}

		return $meta_data;
	}

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setProductAttribute( $value ) {
		$this->setRelation( 'product', $value, Product::class );
	}

	/**
	 * Get the display amount attribute
	 *
	 * @return string
	 */
	public function getDisplayAmountAttribute() {
		if ( $this->ad_hoc ) {
			return esc_html__('Custom Amount', 'surecart');
		}
		return empty( $this->amount ) ? '' : Currency::format( $this->amount, $this->currency );
	}

	/**
	 * The the scratch display amount attribute.
	 *
	 * @return string
	 */
	public function getScratchDisplayAmountAttribute() {
		return  empty( $this->scratch_amount ) ? '' : Currency::format( $this->scratch_amount, $this->currency );
	}

	/**
	 * Get the display price attribute
	 *
	 * @return string
	 */
	public function getIsOnSaleAttribute() {
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
			__('%1s %2s', 'surecart'),
			Currency::format( $this->setup_fee_amount, $this->currency ),
			$this->setup_fee_name ?? __('Setup Fee', 'surecart')
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
		$intervals = wp_parse_args( $intervals, [
			'day'   => __('day', 'surecart'),
			'week'  => __('week', 'surecart'),
			'month' => __('month', 'surecart'),
			'year'  => __('year', 'surecart'),
		] );

		if ( empty($intervals[$this->recurring_interval]) ) {
			return '';
		}

		return sprintf(
			_n( '/ %1s', '/ %2d %1s', $this->recurring_interval_count, 'surecart' ),
			$intervals[$this->recurring_interval],
			(int) $this->recurring_interval_count,
		);
	}

	/**
	 * Get the short interval text attribute
	 *
	 * @return string
	 */
	public function getShortIntervalTextAttribute() {
		return $this->getIntervalTextAttribute( [
			'day'   => __('day', 'surecart'),
			'week'  => __('wk', 'surecart'),
			'month' => __('mo', 'surecart'),
			'year'  => __('yr', 'surecart'),
		] );
	}

	/**
	 * Is this a zero decimal currency price?
	 *
	 * @return boolean
	 */
	public function getIsZeroDecimalAttribute() {
		return Currency::isZeroDecimal($this->currency);
	}

	/**
	 * Get the currency symbol attribute
	 *
	 * @return string
	 */
	public function getCurrencySymbolAttribute() {
		return html_entity_decode( Currency::getCurrencySymbol($this->currency) );
	}
}
