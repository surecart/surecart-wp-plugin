<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\AutoFee;

/**
 * Handle coupon requests through the REST API
 */
class AutoFeesRuleSchemaController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = AutoFeeRuleSchema::class;
}
