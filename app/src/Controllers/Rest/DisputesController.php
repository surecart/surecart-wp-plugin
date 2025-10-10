<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Dispute;

/**
 * Handle Dispute requests through the REST API
 */
class DisputesController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Dispute::class;
}
