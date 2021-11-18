<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Charge;

/**
 * Handle Price requests through the REST API
 */
class ChargesController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Charge::class;
}
