<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\ImportRow;

/**
 * Handle ImportRow requests through the REST API
 */
class ImportRowsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = ImportRow::class;
}
