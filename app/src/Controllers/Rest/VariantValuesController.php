<?php

namespace SureCart\Controllers\Rest;

use SureCart\Concerns\RestrictsAnonymousReads;
use SureCart\Controllers\Rest\RestController;
use SureCart\Models\VariantValue;

/**
 * Handle Variant Values request through the REST API
 */
class VariantValuesController extends RestController {
	use RestrictsAnonymousReads;

	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = VariantValue::class;

	/**
	 * Capability that unlocks unrestricted reads.
	 *
	 * @var string
	 */
	protected $edit_capability = 'edit_sc_prices';

	/**
	 * Expands safe to forward for anonymous callers.
	 *
	 * @var array
	 */
	protected $anonymous_expands = [];

	/**
	 * Query filters forced for anonymous callers.
	 *
	 * @var array
	 */
	protected $anonymous_scope = [];
}
