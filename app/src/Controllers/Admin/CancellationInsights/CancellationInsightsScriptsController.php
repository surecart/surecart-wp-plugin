<?php

namespace SureCart\Controllers\Admin\CancellationInsights;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Coupon page
 */
class CancellationInsightsScriptsController extends AdminModelEditController {
	/**
	 * What types of data to add the the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'currency', 'tax_protocol', 'supported_currencies' ];

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/cancellation_insights';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/cancellation-insights';
}
