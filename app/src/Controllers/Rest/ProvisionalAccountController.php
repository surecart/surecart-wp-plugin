<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\ProvisionalAccount;

/**
 * Handle Provisional account requests through the REST API
 */
class ProvisionalAccountController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = ProvisionalAccount::class;
}
