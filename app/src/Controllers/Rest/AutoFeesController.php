<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\AutoFee;

/**
 * Handle coupon requests through the REST API
 */
class AutoFeesController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = AutoFee::class;
}
