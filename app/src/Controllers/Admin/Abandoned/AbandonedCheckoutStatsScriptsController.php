<?php

namespace SureCart\Controllers\Admin\Abandoned;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Coupon page
 */
class AbandonedCheckoutStatsScriptsController extends AdminModelEditController {
	/**
	 * What types of data to add the the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'currency' ];
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/abandoned_checkout_stats';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/abandoned-checkouts-stats';
}
