<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\ProductCollection;

/**
 * Handle Product Collection requests through the REST API
 */
class ProductCollectionsController extends RestController {
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
	 * Resource slug for the dynamic list filter hooks
	 * (`surecart/product_collections/list/query_args`, `.../list/response`).
	 *
	 * @var string
	 */
	protected $resource = 'product_collections';
}
