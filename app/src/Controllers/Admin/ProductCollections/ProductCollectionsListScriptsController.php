<?php

namespace SureCart\Controllers\Admin\ProductCollections;

use SureCart\Support\Scripts\AdminListDataviewController;

/**
 * Product Collections List Page Scripts
 */
class ProductCollectionsListScriptsController extends AdminListDataviewController {
	/**
	 * What types of data to add to the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'links' ];

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/product-collections-list';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/product-collections-list';

	/**
	 * Add extra data needed by the collections list.
	 */
	public function __construct() {
		$this->data['api_url'] = \SureCart::requests()->getBaseUrl();
	}
}
