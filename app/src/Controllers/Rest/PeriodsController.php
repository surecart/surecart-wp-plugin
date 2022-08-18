<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Period;

/**
 * Handle Price requests through the REST API
 */
class PeriodsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Period::class;
}
