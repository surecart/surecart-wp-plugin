<?php

namespace CheckoutEngine\Controllers\Admin\Orders;

use CheckoutEngine\Support\Scripts\AdminModelEditController;

/**
 * Coupon page
 */
class OrderScriptsController extends AdminModelEditController {
	/**
	 * What types of data to add the the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'currency', 'supported_currencies', 'links' ];

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'checkoutengine/scripts/admin/order';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/orders';
}
