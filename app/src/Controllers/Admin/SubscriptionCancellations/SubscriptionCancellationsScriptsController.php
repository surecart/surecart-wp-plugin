<?php

namespace SureCart\Controllers\Admin\SubscriptionCancellations;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Coupon page
 */
class SubscriptionCancellationsScriptsController extends AdminModelEditController {
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
	protected $handle = 'surecart/scripts/admin/subscription_cancellations';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/subscription-cancellations';
}
