<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\File;

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
