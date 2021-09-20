<?php

namespace CheckoutEngine\Controllers\Admin\Customers;

use CheckoutEngine\Support\Scripts\AdminModelEditController;

/**
 * Customers Page
 */
class CustomersScriptsController extends AdminModelEditController {
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
	protected $handle = 'checkoutengine/scripts/admin/customers';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/customers';
}
