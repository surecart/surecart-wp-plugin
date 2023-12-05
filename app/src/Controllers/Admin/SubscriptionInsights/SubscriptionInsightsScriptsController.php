<?php

namespace SureCart\Controllers\Admin\SubscriptionInsights;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Subscriptions page
 */
class SubscriptionInsightsScriptsController extends AdminModelEditController {
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
	protected $handle = 'surecart/scripts/admin/subscription_insights';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/subscription-insights';
}
