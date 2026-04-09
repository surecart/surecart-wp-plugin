<?php

namespace SureCart\Controllers\Admin\Products;

use SureCart\Support\Scripts\AdminListDataviewController;

/**
 * Products List Page Scripts
 */
class ProductsListScriptsController extends AdminListDataviewController {
	/**
	 * What types of data to add to the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'currency', 'links' ];

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/products-list';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/products-list';

	/**
	 * Add extra data needed by the products list.
	 */
	public function __construct() {
		$this->data['api_url']         = \SureCart::requests()->getBaseUrl();
		$this->data['bulk_delete_url'] = admin_url( 'admin.php' );
	}
}
