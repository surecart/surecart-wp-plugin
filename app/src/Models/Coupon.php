<?php

namespace CheckoutEngine\Models;

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
}
