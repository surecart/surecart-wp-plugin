<?php

namespace SureCart\Controllers\Rest;

use SureCart\Concerns\RestrictsAnonymousReads;
use SureCart\Models\Upsell;

/**
 * Handle upsell requests through the REST API
 */
class UpsellsController extends RestController {
	use RestrictsAnonymousReads;

	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Upsell::class;

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
	protected $anonymous_scope = [ 'archived' => false ];

	/**
	 * Hide archived upsells on find for anonymous callers.
	 *
	 * @var boolean
	 */
	protected $anonymous_hides_archived = true;
}
