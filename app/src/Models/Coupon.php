<?php

namespace SureCart\Models;

use SureCart\Support\Currency;

/**
 * Price model
 */
class Coupon extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'coupons';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'coupon';

	/**
	 * Is this cachable?
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when coupons are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'coupons_updated_at';

	/**
	 * Get the human discount attribute.
	 *
	 * @return string
	 */
	public function getHumanDiscountAttribute() {
		if ( $this->amount_off && $this->currency ) {
			return Currency::format( $this->amount_off, $this->currency );
		}

		if ( $this->percent_off ) {
			return sprintf( __( '%1d%% off', 'surecart' ), $this->percent_off | 0 );
		}

		return '';
	}
}
