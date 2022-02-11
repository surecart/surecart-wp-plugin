<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Invoice;

/**
 * Handle Invoice requests through the REST API
 */
class InvoicesController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Invoice::class;
}
