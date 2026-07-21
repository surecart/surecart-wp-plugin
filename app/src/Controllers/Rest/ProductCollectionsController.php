<?php

namespace SureCart\Controllers\Rest;

use SureCart\Concerns\RestrictsAnonymousReads;
use SureCart\Models\ProductCollection;

/**
 * Handle Product Collection requests through the REST API
 */
class ProductCollectionsController extends RestController {
	use RestrictsAnonymousReads;

	/**
	 * Always fetch with these subcollections.
	 *
	 * @var array
	 */
	protected $with = [ 'image' ];

	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = ProductCollection::class;

	/**
	 * Capability that unlocks unrestricted reads.
	 *
	 * @var string
	 */
	protected $edit_capability = 'edit_sc_products';

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
	protected $anonymous_scope = [ 'archived' => false ];

	/**
	 * Hide archived collections on find for anonymous callers.
	 *
	 * @var boolean
	 */
	protected $anonymous_hides_archived = true;

	/**
	 * Resource slug for the dynamic list filter hooks
	 * (`surecart/product_collections/list/query_args`, `.../list/response`).
	 *
	 * @var string
	 */
	protected $resource = 'product_collections';
}
