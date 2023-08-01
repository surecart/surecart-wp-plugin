<?php

namespace SureCart\Background;

/**
 * SureCart Queue
 *
 * A job queue using WordPress actions.
 */
class AsyncService extends \WP_Async_Request {
	/**
	 * @var string
	 */
	protected $prefix = 'surecart';

	/**
	 * @var string
	 */
	protected $action = 'async_service';

	/**
	 * Handle a dispatched request.
	 *
	 * Override this method to perform any actions required
	 * during the async request.
	 */
	protected function handle() {
		error_log( print_r( $_POST, true ) );
		// $hook = esc_html($_POST['hook']);
		// $data = json_decode(stripslashes($_POST['data']), true);
		// Actions to perform.
	}
}
