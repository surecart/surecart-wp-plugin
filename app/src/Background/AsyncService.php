<?php

namespace SureCart\Background;

/**
 * SureCart Queue
 *
 * A job queue using WordPress actions.
 */
class AsyncService extends \WP_Async_Request {
	/**
	 * Enqueue an action to run one time, as soon as possible
	 *
	 * @var string
	 */
	protected $prefix = 'surecart';

	/**
	 * Action for ajax hooks.
	 *
	 * @var string
	 */
	protected $action = 'async_request';

	/**
	 * Handle a dispatched request.
	 *
	 * Override this method to perform any actions required
	 * during the async request.
	 */
	protected function handle() {
		// Actions to perform.
		error_log( 'handle' );
	}
}
