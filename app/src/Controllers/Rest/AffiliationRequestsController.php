<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\AffiliationRequest;

/**
 * Handle Affiliation Requests through the REST API
 */
class AffiliationRequestsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = AffiliationRequest::class;
}
