<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Swap;

/**
 * Handle swap requests through the REST API
 */
class SwapsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Swap::class;
}
