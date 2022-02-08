<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Refund;

/**
 * Handle Price requests through the REST API
 */
class RefundsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Refund::class;
}
