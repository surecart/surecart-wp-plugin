<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Coupon;
use CheckoutEngine\Models\Traits\HasCoupon;

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
}
