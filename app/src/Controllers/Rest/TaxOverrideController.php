<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\TaxOverride;

/**
 * Handle Tax Override requests through the REST API
 */
class TaxOverrideController extends RestController {
	/**
	 * Always fetch with these subcollections.
	 *
	 * @var array
	 */
	protected $with = [ 'tax_zone' ];

	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = TaxOverride::class;
}
