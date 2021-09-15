<?php

namespace CheckoutEngine\Controllers\Admin\Products;

use CheckoutEngine\Support\Scripts\AdminModelEditController;

/**
 * Product Page
 */
class ProductScriptsController extends AdminModelEditController {
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
	protected $handle = 'checkoutengine/scripts/admin/product';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/products';
}
