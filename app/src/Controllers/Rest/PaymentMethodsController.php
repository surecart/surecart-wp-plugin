<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\PaymentMethod;

/**
 * Handle Price requests through the REST API
 */
class PaymentMethodsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = PaymentMethod::class;
}
