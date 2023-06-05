<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\LineItem;

/**
 * Handle LineItem requests through the REST API
 */
class LineItemsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = LineItem::class;
}
