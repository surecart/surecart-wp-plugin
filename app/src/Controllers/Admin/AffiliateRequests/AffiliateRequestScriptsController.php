<?php

namespace SureCart\Controllers\Admin\AffiliateRequests;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Product Page
 */
class AffiliateRequestScriptsController extends AdminModelEditController {
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
	protected $handle = 'surecart/scripts/admin/affiliate-request';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/affiliate-requests';

	/**
	 * Add the app url to the data.
	 */
	public function __construct() {
		$this->data['api_url'] = \SureCart::requests()->getBaseUrl();
	}
}
