<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\ParcelTemplate;

/**
 * Handle Parcel Template requests through the REST API
 */
class ParcelTemplateController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = ParcelTemplate::class;
}
