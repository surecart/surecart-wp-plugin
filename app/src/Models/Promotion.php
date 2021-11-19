<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Coupon;

/**
 * Price model
 */
class Promotion extends Model {
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
	 * Set the coupon attribute
	 *
	 * @param  string $value Coupon properties.
	 * @return void
	 */
	public function setCouponAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['coupon'] = $value;
			return;
		}
		$this->attributes['coupon'] = new Coupon( $value );
	}
}
