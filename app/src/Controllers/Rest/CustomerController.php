<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Customer;

/**
 * Handle Price requests through the REST API
 */
class CustomerController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Customer::class;
}
