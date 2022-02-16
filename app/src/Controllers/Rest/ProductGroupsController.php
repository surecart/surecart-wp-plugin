<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\ProductGroup;

/**
 * Handle Product requests through the REST API
 */
class ProductGroupsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = ProductGroup::class;
}
