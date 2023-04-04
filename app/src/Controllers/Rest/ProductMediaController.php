<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\ProductMedia;

/**
 * Handle ProductMedia requests through the REST API
 */
class ProductMediaController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = ProductMedia::class;
}
