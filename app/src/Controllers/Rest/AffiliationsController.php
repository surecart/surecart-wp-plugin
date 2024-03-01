<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Affiliation;

/**
 * Handle Affiliations through the REST API
 */
class AffiliationsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Affiliation::class;
}
