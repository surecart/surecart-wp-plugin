<?php

namespace SureCart\Controllers\Admin\Affiliates;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Afiiates scripts controller.
 */
class AffiliatesScriptsController extends AdminModelEditController {
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
	protected $handle = 'surecart/scripts/admin/affiliates';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/affiliates';

	/**
	 * Add the app url to the data.
	 */
	public function __construct() {
		$this->data['api_url'] = \SureCart::requests()->getBaseUrl();
	}
}
