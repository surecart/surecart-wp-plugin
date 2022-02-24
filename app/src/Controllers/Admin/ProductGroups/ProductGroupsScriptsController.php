<?php

namespace CheckoutEngine\Controllers\Admin\ProductGroups;

use CheckoutEngine\Support\Scripts\AdminModelEditController;

/**
 * Product Group Scripts
 */
class ProductGroupsScriptsController extends AdminModelEditController {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'checkoutengine/scripts/admin/product-groups';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/product-groups';
}
