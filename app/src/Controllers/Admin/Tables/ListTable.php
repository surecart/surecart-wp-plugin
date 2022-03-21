<?php

namespace SureCart\Controllers\Admin\Tables;

use SureCart\Support\TimeDate;

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
	 * Define which columns are hidden
	 *
	 * @return Array
	 */
	public function get_hidden_columns() {
		return array();
	}

	/**
	 * Get the archive query status.
	 *
	 * @return boolean|null
	 */
	public function getArchiveStatus( $default = 'active' ) {
		$status = sanitize_text_field( $_GET['status'] ?? $default );

		$archived = false;
		if ( 'archived' === $status ) {
			$archived = true;
		}
		if ( 'all' === $status ) {
			$archived = null;
		}

		return $archived;
	}

	/**
	 * Handle the date
	 *
	 * @param \SureCart\Models\Model $model Model.
	 *
	 * @return string
	 */
	public function column_date( $model ) {
		$created = sprintf(
			'<time datetime="%1$s" title="%2$s">%3$s</time>',
			esc_attr( $model->created_at ),
			esc_html( TimeDate::formatDateAndTime( $model->created_at ) ),
			esc_html( TimeDate::humanTimeDiff( $model->created_at ) )
		);
		$updated = sprintf(
			'%1$s <time datetime="%2$s" title="%3$s">%4$s</time>',
			__( 'Updated', 'surecart' ),
			esc_attr( $model->updated_at ),
			esc_html( TimeDate::formatDateAndTime( $model->updated_at ) ),
			esc_html( TimeDate::humanTimeDiff( $model->updated_at ) )
		);
		return $created . '<br /><small style="opacity: 0.75">' . $updated . '</small>';
	}

	/**
	 * Handle the created column
	 *
	 * @param \SureCart\Models\Model $model Model.
	 *
	 * @return string
	 */
	public function column_created( $model ) {
		return sprintf(
			'<ce-format-date
				date="%1$s"
				month="long"
				day="numeric"
				year="numeric"
				type="timestamp"></ce-format-date>',
			esc_attr( $model->created_at )
		);
	}

	public function column_mode( $order ) {
		return ! $order->live_mode ? '<ce-tag type="warning">' . __( 'Test', 'surecart' ) . '</ce-tag>' : '';
	}
}
