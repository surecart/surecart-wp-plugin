<?php

namespace SureCart\Controllers\Rest;

use SureCart\Concerns\RestrictsAnonymousReads;
use SureCart\Controllers\Rest\RestController;
use SureCart\Models\Variant;

/**
 * Handle Variants request through the REST API
 */
class VariantsController extends RestController {
	use RestrictsAnonymousReads;

	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Variant::class;

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
	protected $anonymous_expands = [ 'image' ];

	/**
	 * Query filters forced for anonymous callers.
	 *
	 * @var array
	 */
	protected $anonymous_scope = [];
}
