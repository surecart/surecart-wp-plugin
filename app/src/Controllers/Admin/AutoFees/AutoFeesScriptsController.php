<?php

namespace SureCart\Controllers\Admin\AutoFees;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Auto Fees Requests Scripts Controller
 */
class AutoFeesScriptsController extends AdminModelEditController {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/auto-fee';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/auto-fees';
}
