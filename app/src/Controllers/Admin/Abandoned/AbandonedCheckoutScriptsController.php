<?php

namespace CheckoutEngine\Controllers\Admin\Abandoned;

use CheckoutEngine\Support\Scripts\AdminModelEditController;

/**
 * Coupon page
 */
class AbandonedCheckoutScriptsController extends AdminModelEditController {
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
	protected $handle = 'checkoutengine/scripts/admin/abandoned_checkout';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'dist/admin/order.js';
}
