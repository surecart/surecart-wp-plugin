<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Batch;

/**
 * Handle Batch API requests through the REST proxy.
 */
class BatchesController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Batch::class;

	/**
	 * Resource slug for the dynamic list filter hooks.
	 *
	 * @var string
	 */
	protected $resource = 'batches';
}
