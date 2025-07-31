<?php

namespace SureCart\Controllers\Admin\AutoFees;

use SureCart\Support\Currency;
use SureCart\Controllers\Admin\Tables\ListTable;
use SureCart\Models\AutoFee;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class AutoFeesListTable extends ListTable {
	/**
	 * Prepare the items for the table to process
	 *
	 * @return Void
	 */
	public function prepare_items() {
		$columns  = $this->get_columns();
		$hidden   = $this->get_hidden_columns();
		$sortable = $this->get_sortable_columns();

		$this->_column_headers = array( $columns, $hidden, $sortable );

		$query = $this->table_data();

		if ( is_wp_error( $query ) ) {
			$this->items = [];
			return;
		}

		$this->set_pagination_args(
			[
				'total_items' => $query->pagination->count,
				'per_page'    => $this->get_items_per_page( 'orders' ),
			]
		);

		$this->items = $query->data;
	}

	/**
	 * Search form for the table.
	 *
	 * @return void
	 */
	public function search() {
		?>
	<form class="search-form"
		method="get">
		<?php $this->search_box( __( 'Search Auto Fees', 'surecart' ), 'order' ); ?>
		<input type="hidden"
			name="id"
			value="1" />
	</form>
		<?php
	}

	/**
	 * @global int $post_id
	 * @global string $comment_status
	 * @global string $comment_type
	 */
	protected function get_views() {
		$stati = [
			'all'      => __( 'All', 'surecart' ),
			'active'   => __( 'Active', 'surecart' ),
			'inactive' => __( 'Inactive', 'surecart' ),
		];

		foreach ( $stati as $status => $label ) {
			$link                    = \SureCart::getUrl()->index( 'auto-fees' );
			$current_link_attributes = '';

			if ( ! empty( $_GET['status'] ) ) {
				if ( $status === $_GET['status'] ) {
					$current_link_attributes = ' class="current" aria-current="page"';
				}
			} elseif ( 'all' === $status ) {
				$current_link_attributes = ' class="current" aria-current="page"';
			}

			$link = add_query_arg( 'status', $status, $link );

			$link = esc_url( $link );

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
		return apply_filters( 'surecart/auto_fees/index/links', $status_links );
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return Array
	 */
	public function get_columns() {
		return array_merge(
			[
				'name'   => __( 'Name', 'surecart' ),
				'status' => __( 'Status', 'surecart' ),
				'date'   => __( 'Date', 'surecart' ),
			],
			parent::get_columns()
		);
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
	 * Define the sortable columns
	 *
	 * @return Array
	 */
	public function get_sortable_columns() {
		return array( 'name' => array( 'name', false ) );
	}

	/**
	 * Get the table data
	 *
	 * @return Array
	 */
	protected function table_data() {
		$conditions = [
			'query'  => $this->get_search_query(),
		];

		if ( 'active' === $this->getStatus() ) {
			$conditions['enabled'] = true;
		}

		if ( 'inactive' === $this->getStatus() ) {
			$conditions['enabled'] = false;
		}

		return AutoFee::where( $conditions )
		->paginate(
			[
				'per_page' => $this->get_items_per_page( 'subscriptions' ),
				'page'     => $this->get_pagenum(),
			]
		);
	}

	/**
	 * Get the archive query status.
	 *
	 * @return boolean|null
	 */
	public function getStatus() {
		$status = sanitize_text_field( wp_unslash( $_GET['status'] ?? false ) );

		return $status;
	}

	/**
	 * Handle the status
	 *
	 * @param \SureCart\Models\AutoFees $auto_fees AutoFees model.
	 *
	 * @return string
	 */
	public function column_status( $auto_fees ) {
		$toggle_url = add_query_arg(
			[
				'action' => 'toggle_active',
				'nonce'  => wp_create_nonce( 'archive_product' ), // use archive product nonce.
				'id'     => $auto_fees->id,
			]
		);
		?>
		<sc-switch checked="<?php echo esc_attr( $auto_fees->enabled ) ? 'true' : 'false'; ?>"
			onClick="window.location.assign('<?php echo esc_url_raw( $toggle_url ); ?>'); document.querySelector('#loading-<?php echo esc_attr( $auto_fees->id ); ?>').style.display = '';"></sc-switch>
		<sc-block-ui id="loading-<?php echo esc_attr( $auto_fees->id ); ?>" spinner style="display: none;"></sc-block-ui>
		<?php
	}

	/**
	 * Handle the status
	 *
	 * @param \SureCart\Models\AutoFees $auto_fees AutoFees model.
	 *
	 * @return string
	 */
	public function column_name( $auto_fees ) {
		return '<a href="' . \SureCart::getUrl()->edit( 'auto-fee', $auto_fees->id ) . '">'
				. $auto_fees->name
				. '</a>';
	}

	/**
	 * Displays extra table navigation.
	 *
	 * @param string $which Top or bottom placement.
	 */
	protected function extra_tablenav( $which ) {
		?>
		<input type="hidden" name="page" value="sc-auto-fees" />

		<div class="alignleft actions">
		<?php
		if ( 'top' === $which ) {
			ob_start();
			$this->mode_dropdown();

			/**
			 * Fires before the Filter button on the Posts and Pages list tables.
			 *
			 * The Filter button allows sorting by date and/or category on the
			 * Posts list table, and sorting by date on the Pages list table.
			 *
			 * @since 2.1.0
			 * @since 4.4.0 The `$post_type` parameter was added.
			 * @since 4.6.0 The `$which` parameter was added.
			 *
			 * @param string $post_type The post type slug.
			 * @param string $which     The location of the extra table nav markup:
			 *                          'top' or 'bottom' for WP_Posts_List_Table,
			 *                          'bar' for WP_Media_List_Table.
			 */
			do_action( 'restrict_manage_auto_fees', $this->screen->post_type, $which );

			$output = ob_get_clean();

			if ( ! empty( $output ) ) {
				echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				submit_button( __( 'Filter' ), '', 'filter_action', false, array( 'id' => 'filter-by-mode-submit' ) );
			}
		}

		?>
		</div>

		<?php
		/**
		 * Fires immediately following the closing "actions" div in the tablenav for the posts
		 * list table.
		 *
		 * @since 4.4.0
		 *
		 * @param string $which The location of the extra table nav markup: 'top' or 'bottom'.
		 */
		do_action( 'manage_auto_fees_extra_tablenav', $which );
	}
}
