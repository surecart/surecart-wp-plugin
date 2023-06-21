<?php

namespace SureCart\Controllers\Admin\ProductCollections;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Product Collection Scripts
 */
class ProductCollectionsScriptsController extends AdminModelEditController {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/product-collections';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/product-collections';
}
