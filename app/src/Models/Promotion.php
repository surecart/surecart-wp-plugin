<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCoupon;
use SureCart\Support\TimeDate;

/**
 * Price model
 */
class Promotion extends Model {
	use HasCoupon;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'promotions';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'promotion';

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
	protected $cache_key = 'coupons';

	/**
	 * Get the Redeem By Date attribute.
	 *
	 * @return string
	 */
	public function getRedeemByDateAttribute() {
		return ! empty( $this->redeem_by ) ? TimeDate::formatDate( $this->redeem_by ) : '';
	}

	/**
	 * Get the Redeem By Date Time attribute.
	 *
	 * @return string
	 */
	public function getRedeemByDateTimeAttribute() {
		return ! empty( $this->redeem_by ) ? TimeDate::formatDateAndTime( $this->redeem_by ) : '';
	}
}
