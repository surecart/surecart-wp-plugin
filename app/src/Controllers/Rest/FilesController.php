<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\File;

/**
 * Handle File requests through the REST API
 */
class FilesController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = File::class;
}
