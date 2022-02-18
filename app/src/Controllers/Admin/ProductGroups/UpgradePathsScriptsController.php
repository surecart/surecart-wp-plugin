<?php

namespace CheckoutEngine\Controllers\Admin\UpgradePaths;

use CheckoutEngine\Support\Scripts\AdminModelEditController;

/**
 * Coupon page
 */
class UpgradePathsScriptsController extends AdminModelEditController {
	/**
	 * Are we editing a single page?
	 *
	 * @var array
	 */
	protected $url_query = [];

	/**
	 * Additional dependencies
	 *
	 * @var array
	 */
	protected $dependencies = [];

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'checkoutengine/scripts/admin/upgrade-paths';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/upgrade-paths';
}
