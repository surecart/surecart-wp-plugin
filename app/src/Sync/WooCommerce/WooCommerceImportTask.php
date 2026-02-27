<?php

namespace SureCart\Sync\WooCommerce;

use SureCart\Sync\Tasks\Task;

/**
 * Lightweight task for WooCommerce product import.
 *
 * Exists primarily so Job::isRunning() can check $this->task->showNotice()
 * to determine if the import is still active.
 *
 * @package SureCart
 */
class WooCommerceImportTask extends Task {

	/**
	 * The action name.
	 *
	 * @var string
	 */
	protected $action_name = 'surecart/sync/woocommerce_import';

	/**
	 * Handle the task.
	 *
	 * This task does not process individual items -- the Job handles batch processing.
	 *
	 * @param string  $id          The id.
	 * @param boolean $show_notice Whether to show a notice.
	 *
	 * @return void
	 */
	public function handle( $id, $show_notice = false ) {
		// No-op: batch processing is handled by WooCommerceImportJob.
	}
}
