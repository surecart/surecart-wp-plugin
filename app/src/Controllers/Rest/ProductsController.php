<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Product;

/**
 * Handle Product requests through the REST API
 */
class ProductsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Product::class;
}
