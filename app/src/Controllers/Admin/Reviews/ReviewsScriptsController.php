<?php

namespace SureCart\Controllers\Admin\Reviews;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Reviews Page
 */
class ReviewsScriptsController extends AdminModelEditController {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/reviews';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/reviews';
}
