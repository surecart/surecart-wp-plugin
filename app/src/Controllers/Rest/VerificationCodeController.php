<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\VerificationCode;

/**
 * Handle coupon requests through the REST API
 */
class VerificationCodeController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = VerificationCode::class;
}
