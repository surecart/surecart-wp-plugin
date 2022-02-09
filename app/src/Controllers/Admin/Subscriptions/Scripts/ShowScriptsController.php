<?php

namespace CheckoutEngine\Controllers\Admin\Subscriptions\Scripts;

use CheckoutEngine\Support\Scripts\AdminModelEditController;

/**
 * Coupon page
 */
class ShowScriptsController extends AdminModelEditController {
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
	protected $handle = 'checkoutengine/scripts/admin/subscription/show';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/subscriptions/show';
}
