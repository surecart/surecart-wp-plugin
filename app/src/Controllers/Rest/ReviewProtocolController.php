<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\ReviewProtocol;

/**
 * Handle ReviewProtocol requests through the REST API.
 */
class ReviewProtocolController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = ReviewProtocol::class;
}
