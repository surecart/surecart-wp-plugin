<?php

namespace CheckoutEngine\WordPress\Admin\Coupons;

use CheckoutEngine\Support\Scripts\AdminModelEditController;

/**
 * Coupon page
 */
class CouponEditPageScripts extends AdminModelEditController {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'checkoutengine/scripts/admin/products';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'dist/admin/products.js';
}
