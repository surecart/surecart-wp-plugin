<?php

namespace CheckoutEngine\Controllers\Admin\Tables;

// WP_List_Table is not loaded automatically so we need to load it in our application.
if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

/**
 * Base list table class.
 */
abstract class ListTable extends \WP_List_Table {
	public $checkbox = true;

	/**
	 * Show filters in extra tablenav top
	 *
	 * @param [type] $which
	 * @return void
	 */
	protected function extra_tablenav( $which ) {
		if ( 'top' === $which ) {
			return $this->views();
		}
	}

	/**
	 * Get the archive query status.
	 *
	 * @return boolean|null
	 */
	public function getArchiveStatus() {
		$status = sanitize_text_field( $_GET['product_status'] ?? 'active' );

		$archived = false;
		if ( 'archived' === $status ) {
			$archived = true;
		}
		if ( 'all' === $status ) {
			$archived = null;
		}

		return $archived;
	}
}
