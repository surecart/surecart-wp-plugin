<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\ProductCollection;

/**
 * Handle Product Collection requests through the REST API
 */
class ProductCollectionsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = ProductCollection::class;
}
