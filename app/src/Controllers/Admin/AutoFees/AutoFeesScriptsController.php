<?php

namespace SureCart\Controllers\Admin\AutoFees;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Affiliation Requests Scripts Controller
 */
class AutoFeesScriptsController extends AdminModelEditController {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/auto-fee';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/auto-fees';

	/**
	 * Add the app url to the data.
	 */
	public function __construct() {
		$this->data['api_url'] = \SureCart::requests()->getBaseUrl();
	}
}
