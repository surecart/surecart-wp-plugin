<?php

namespace SureCart\Controllers\Admin\TestModeToggle;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Test Mode Toggle Scripts Controller
 */
class TestModeToggleScriptsController extends AdminModelEditController {
	/**
	 * What types of data to add the the page.
	 *
	 * @var array
	 */
	protected $with_data = array();

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/test-mode-toggle';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/test-mode-toggle';
}
