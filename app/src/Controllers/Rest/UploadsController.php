<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Upload;

/**
 * Handle Price requests through the REST API
 */
class UploadsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Upload::class;
}
