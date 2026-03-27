<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\DisplayCurrency;

/**
 * Handle Display Currency requests through the REST API
 */
class DisplayCurrencyController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = DisplayCurrency::class;
}
