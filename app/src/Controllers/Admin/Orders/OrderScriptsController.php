<?php

namespace SureCart\Controllers\Admin\Orders;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Coupon page
 */
class OrderScriptsController extends AdminModelEditController {
	/**
	 * What types of data to add the the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'currency', 'supported_currencies', 'links', 'shipping_protocol', 'i18n' ];

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/order';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/orders';

	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 */
	public function enqueue() {
		parent::enqueue();
		// Enqueue CodeMirror editor with wp.codeEditor API.
		wp_enqueue_code_editor(
			[
				'type'       => 'application/json',
				'codemirror' => [
					'indentUnit' => 2,
					'tabSize'    => 2,
				],
			]
		);
	}
}
