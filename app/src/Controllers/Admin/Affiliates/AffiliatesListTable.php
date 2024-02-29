<?php

namespace SureCart\Controllers\Admin\Affiliates;

use SureCart\Controllers\Admin\Tables\ListTable;
use SureCart\Models\Affiliation;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class AffiliatesListTable extends ListTable {
	public $checkbox = true;
	public $error    = '';
	public $pages    = array();

	/**
	 * Prepare the items for the table to process
	 *
	 * @return void
	 */
	public function prepare_items() {
		$columns  = $this->get_columns();
		$hidden   = $this->get_hidden_columns();
		$sortable = $this->get_sortable_columns();

		$this->_column_headers = array( $columns, $hidden, $sortable );

		$query = $this->table_data();

		if ( is_wp_error( $query ) ) {
			$this->error = $query->get_error_message();
			$this->items = array();
			return;
		}

		$this->set_pagination_args(
			array(
				'total_items' => $query->pagination->count,
				'per_page'    => $this->get_items_per_page( 'affiliations' ),
			)
		);

		$this->items = $query->data;
	}

	/**
	 * Get views for the list table status links.
	 *
	 * @global int $post_id
	 * @global string $comment_status
	 * @global string $comment_type
	 */
	protected function get_views() {
		$link = admin_url( 'admin.php?page=sc-affiliates' );

		foreach ( $this->getStatuses() as $status => $label ) {
			$current_link_attributes = '';

			if ( ! empty( $_GET['status'] ) ) {
				if ( $status === $_GET['status'] ) {
					$current_link_attributes = ' class="current" aria-current="page"';
				}
			} elseif ( 'active' === $status ) {
				$current_link_attributes = ' class="current" aria-current="page"';
			}

			$link = add_query_arg( 'status', $status, $link );

			$status_links[ $status ] = "<a href='$link'$current_link_attributes>" . $label . '</a>';
		}

		/**
		 * Filters the comment status links.
		 *
		 * @since 2.5.0
		 * @since 5.1.0 The 'Mine' link was added.
		 *
		 * @param string[] $status_links An associative array of fully-formed comment status links. Includes 'All', 'Mine',
		 *                              'Pending', 'Approved', 'Spam', and 'Trash'.
		 */
		return apply_filters( 'comment_status_links', $status_links );
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return array
	 */
	public function get_columns() {
		return array(
			// 'cb'          => '<input type="checkbox" />',
			'name'   => __( 'Name', 'surecart' ),
			'email'  => __( 'Email', 'surecart' ),
			'status' => __( 'Status', 'surecart' ),
			'date'   => __( 'Date', 'surecart' ),
		);
	}

	/**
	 * Displays the checkbox column.
	 *
	 * @param Affiliation $affiliation The current affiliates.
	 */
	public function column_cb( $affiliation ) {
		?>
		<label class="screen-reader-text" for="cb-select-<?php echo esc_attr( $affiliation['id'] ); ?>"><?php _e( 'Select comment', 'surecart' ); ?></label>
		<input id="cb-select-<?php echo esc_attr( $affiliation['id'] ); ?>" type="checkbox" name="delete_comments[]" value="<?php echo esc_attr( $affiliation['id'] ); ?>" />
		<?php
	}

	/**
	 * Define which columns are hidden
	 *
	 * @return array
	 */
	public function get_hidden_columns() {
		return array();
	}

	/**
	 * Get the table data
	 *
	 * @return array
	 */
	private function table_data() {
		$affiates_query = Affiliation::where(
			array(
				'active' => $this->getFilteredStatus(),
				'query'  => $this->get_search_query()
			)
		);

		return $affiates_query->paginate(
			array(
				'per_page' => $this->get_items_per_page( 'affiate' ),
				'page'     => $this->get_pagenum(),
			)
		);
	}

	/**
	 * Nothing found.
	 *
	 * @return void
	 */
	public function no_items() {
		if ( $this->error ) {
			echo esc_html( $this->error );
			return;
		}
		echo esc_html_e( 'No affiliates found.', 'surecart' );
	}

	/**
	 * Published column
	 *
	 * @param \SureCart\Models\Affiliation $affiliation Affiliation model.
	 *
	 * @return string
	 */
	public function column_status( $affiliation ) {
		ob_start();
		$status_type = '';
		switch ( $affiliation->active ) {
			case true:
				$status_type = 'success';
				break;
			case false:
				$status_type = 'warning';
				break;
		}
		?>
		<sc-tag type="<?php echo esc_attr( $status_type ); ?>">
			<?php echo esc_html( $this->getStatuses()[ $affiliation->active ? 'active' : 'inactive' ] ); ?>
		</sc-tag>
		<?php
		return ob_get_clean();
	}

	/**
	 * Define what data to show on each column of the table
	 *
	 * @param \SureCart\Models\Affiliation $affiliation Affiliation model.
	 * @param string                       $column_name - Current column name.
	 *
	 * @return mixed
	 */
	public function column_default( $affiliation, $column_name ) {
		switch ( $column_name ) {
			case 'name':
				return '<a href="' . \SureCart::getUrl()->edit( 'affiliate', $affiliation->id ) . '">'
					. $affiliation->first_name . ' ' . $affiliation->last_name
					. '</a>';

			case 'description':
			case 'email':
				return $affiliation->$column_name ?? '';
		}
	}

	/**
	 * Displays extra table navigation.
	 *
	 * @param string $which Top or bottom placement.
	 */
	protected function extra_tablenav( $which ) {
		?>
		<input type="hidden" name="page" value="sc-affiliates" />

		<?php if ( ! empty( $_GET['status'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<input type="hidden" name="status" value="<?php echo esc_attr( $_GET['status'] ); ?>" />
		<?php endif; ?>

		<?php
		/**
		 * Fires immediately following the closing "actions" div in the tablenav
		 * for the affiliates list table.
		 *
		 * @param string $which The location of the extra table nav markup: 'top' or 'bottom'.
		 */
		do_action( 'manage_affiliates_extra_tablenav', $which );
	}


	/**
	 * Get filtered status / default status.
	 *
	 * @return string|null
	 */
	private function getFilteredStatus() {
		if ( ! empty( $_GET['status'] ) ) {
			$status = sanitize_text_field( wp_unslash( $_GET['status'] ) );
			if ( 'all' === $status ) {
				return null;
			}

			return 'active' === $status ? '1' : '0';
		}

		return '1';
	}

	/**
	 * Get all statuses.
	 *
	 * @return array
	 */
	private function getStatuses(): array {
		return array(
			'active'   => __( 'Active', 'surecart' ),
			'inactive' => __( 'Inactive', 'surecart' ),
			'all'      => __( 'All', 'surecart' ),
		);
	}
}
