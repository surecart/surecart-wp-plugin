<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Processor;

/**
 * Handle Price requests through the REST API
 */
class ProcessorController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Processor::class;
}
