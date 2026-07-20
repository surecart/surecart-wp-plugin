<?php

namespace SureCart\Controllers\Admin\Bundles;

use SureCart\Controllers\Admin\Products\ProductScriptsController;

/**
 * Bundle page scripts.
 */
class BundleScriptsController extends ProductScriptsController {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/bundle';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/bundles';
}
