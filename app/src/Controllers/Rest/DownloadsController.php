<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Download;

/**
 * Handle Download requests through the REST API
 */
class DownloadsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Download::class;

	/**
	 * Always fetch with media and variant
	 *
	 * @var array
	 */
	protected $with = [ 'media', 'variant' ];
}
