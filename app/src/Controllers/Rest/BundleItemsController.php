<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\BundleItem;

/**
 * Handle bundle item requests through the REST API.
 */
class BundleItemsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = BundleItem::class;
}
