<?php

namespace CheckoutEngine\Controllers\Admin\Coupons;

use CheckoutEngine\Support\Scripts\AdminModelEditController;

/**
 * Coupon page
 */
class CouponScriptsController extends AdminModelEditController {
	/**
	 * What types of data to add the the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'currency', 'supported_currencies' ];

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'checkoutengine/scripts/admin/coupon';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'dist/admin/coupons.js';
}
