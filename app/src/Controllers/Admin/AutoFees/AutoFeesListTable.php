<?php

namespace SureCart\Controllers\Admin\AutoFees;

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
		$columns = $this->get_columns();
		$hidden  = $this->get_hidden_columns();

		$this->_column_headers = array( $columns, $hidden );

		$query = $this->table_data();

		if ( is_wp_error( $query ) ) {
			$this->items = [];
			return;
		}

		$this->set_pagination_args(
			[
				'total_items' => $query->pagination->count,
				'per_page'    => $this->get_items_per_page( 'auto-fees' ),
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
		<?php $this->search_box( __( 'Search Dynamic Prices', 'surecart' ), 'order' ); ?>
		<input type="hidden"
			name="id"
			value="1" />
	</form>
		<?php
	}

	/**
	 * Get the views for the list table.
	 *
	 * @return array
	 */
	protected function get_views() {
		$stati = [
			'all'      => __( 'All', 'surecart' ),
			'active'   => __( 'Active', 'surecart' ),
			'inactive' => __( 'Inactive', 'surecart' ),
		];

		foreach ( $stati as $status => $label ) {
			$link                    = esc_url_raw( \SureCart::getUrl()->index( 'auto-fees' ) );
			$current_link_attributes = '';

			if ( ! empty( $_GET['status'] ) ) {
				if ( $status === sanitize_text_field( wp_unslash( $_GET['status'] ) ) ) {
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
	 * @return array
	 */
	public function get_columns() {
		return array_merge(
			[
				'internal_name' => __( 'Name', 'surecart' ),
				'name'          => __( 'Display Name', 'surecart' ),
				'status'        => __( 'Status', 'surecart' ),
				'type'          => __( 'Type', 'surecart' ),
				'date'          => __( 'Date', 'surecart' ),
			],
			parent::get_columns()
		);
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
	 * @return \SureCart\Models\AutoFee[]|\WP_Error
	 */
	protected function table_data() {
		$conditions = [
			'query' => $this->get_search_query(),
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
				'per_page' => $this->get_items_per_page( 'auto-fees' ),
				'page'     => $this->get_pagenum(),
			]
		);
	}

	/**
	 * Get the archive query status.
	 *
	 * @return bool|null
	 */
	public function getStatus() {
		return sanitize_text_field( wp_unslash( $_GET['status'] ?? false ) );
	}

	/**
	 * Handle the status
	 *
	 * @param \SureCart\Models\AutoFee $auto_fees Auto Fee model.
	 *
	 * @return void
	 */
	public function column_status( $auto_fees ) {
		$toggle_url = add_query_arg(
			[
				'action' => 'toggle_active',
				'nonce'  => wp_create_nonce( 'archive_dynamic_price' ),
				'id'     => $auto_fees->id,
				'status' => 'all',
			]
		);
		?>
		<sc-switch checked="<?php echo esc_attr( $auto_fees->enabled ) ? 'true' : 'false'; ?>"
			onClick="window.location.assign('<?php echo esc_url_raw( $toggle_url ); ?>'); document.querySelector('#loading-<?php echo esc_attr( $auto_fees->id ); ?>').style.display = '';"></sc-switch>
		<sc-block-ui id="loading-<?php echo esc_attr( $auto_fees->id ); ?>" spinner style="display: none;"></sc-block-ui>
		<?php
	}

	/**
	 * Name
	 *
	 * @param \SureCart\Models\AutoFees $auto_fees AutoFees model.
	 *
	 * @return string
	 */
	public function column_name( $auto_fees ) {
		return $auto_fees->name;
	}

	/**
	 * Internal name.
	 *
	 * @param \SureCart\Models\AutoFees $auto_fees AutoFees model.
	 *
	 * @return string
	 */
	public function column_internal_name( $auto_fees ) {
		ob_start();
		?>
		<a href="<?php echo esc_url_raw( \SureCart::getUrl()->edit( 'auto-fee', $auto_fees->id ) ); ?>">
			<?php echo esc_html( $auto_fees->metadata->internal_name ?? '' ); ?>
		</a>
		<?php echo wp_kses_post( $this->getRowActions( $auto_fees ) ); ?>

		<?php
		return ob_get_clean();
	}

	/**
	 * Handle the target.
	 *
	 * @param \SureCart\Models\AutoFees $auto_fees AutoFees model.
	 *
	 * @return string
	 */
	public function column_type( $auto_fees ) {
		$translations = [
			'checkout'  => [
				'label' => __( 'Checkout', 'surecart' ),
				'icon'  => 'shopping-cart',
			],
			'line_item' => [
				'label' => __( 'Line Item', 'surecart' ),
				'icon'  => 'layout-list',
			],
			'shipping'  => [
				'label' => __( 'Shipping', 'surecart' ),
				'icon'  => 'truck',
			],
		];

		// Determine fee/discount type.
		$is_discount    = (bool) $auto_fees->discount;
		$type_label     = $is_discount ? __( 'Discount', 'surecart' ) : __( 'Fee', 'surecart' );
		$type_tag_type  = $is_discount ? 'success' : 'danger';
		$type_icon_name = $is_discount ? 'arrow-down-right' : 'arrow-up-right';

		// Get target information.
		$target_data  = $translations[ $auto_fees->fee_target ] ?? $translations['checkout'];
		$target_label = $target_data['label'];
		$target_icon  = $target_data['icon'];

		// Build the fee/discount tag.
		$type_tag = sprintf(
			'<sc-tag type="%s" pill><div style="display: flex; align-items: center; gap: 0.5em;"><sc-icon name="%s"></sc-icon>%s</div></sc-tag>',
			esc_attr( $type_tag_type ),
			esc_attr( $type_icon_name ),
			esc_html( $type_label )
		);

		// Build the target tag.
		$target_tag = sprintf(
			'<sc-tag type="info" pill><div style="display: flex; align-items: center; gap: 0.5em;"><sc-icon name="%s"></sc-icon>%s</div></sc-tag>',
			esc_attr( $target_icon ),
			esc_html( $target_label )
		);

		// Build the translated sentence with flex container for vertical alignment.
		return sprintf(
			/* translators: %1$s: Fee or Discount tag HTML, %2$s: Target tag HTML (e.g., Checkout, Line Item, Shipping) */
			'<sc-flex align-items="center" justify-content="flex-start" style="--sc-flex-column-gap: 0.35em; flex-wrap: wrap;">' . __( 'Apply a %1$s to %2$s', 'surecart' ) . '</sc-flex>',
			$type_tag,
			$target_tag
		);
	}

	/**
	 * Get row actions.
	 *
	 * @param \SureCart\Models\AutoFee $auto_fees Auto Fee model.
	 *
	 * @return array
	 */
	public function getRowActions( $auto_fees ) {
		return $this->row_actions(
			array_filter(
				[
					'edit'   => '<a href="' . esc_url( \SureCart::getUrl()->edit( 'auto-fee', $auto_fees->id ) ) . '" aria-label="' . esc_attr( 'Edit Dynamic Pricing', 'surecart' ) . '">' . esc_html__( 'Edit', 'surecart' ) . '</a>',
					'delete' => '<a href="' . esc_url( $this->get_action_url( $auto_fees->id, 'delete' ) ) . '">' . esc_html__( 'Delete', 'surecart' ) . '</a>',
				]
			)
		);
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
			 * Fires before the Filter button on the Auto fees list tables.
			 *
			 * The Filter button allows sorting by date and/or category on the
			 * auto fees list table, and sorting by date on the Pages list table.
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
		 * Fires immediately following the closing "actions" div in the tablenav for the auto fees
		 * list table.
		 *
		 * @since 4.4.0
		 *
		 * @param string $which The location of the extra table nav markup: 'top' or 'bottom'.
		 */
		do_action( 'manage_auto_fees_extra_tablenav', $which );
	}

	/**
	 * Get action url.
	 *
	 * @param int    $id     The id.
	 * @param string $action The action.
	 *
	 * @return string
	 */
	public function get_action_url( $id, $action ) {
		return esc_url(
			add_query_arg(
				[
					'action' => $action,
					'nonce'  => wp_create_nonce( $action . '_auto_fee' ),
					'id'     => $id,
				],
				esc_url_raw( \SureCart::getUrl()->index( 'auto-fees' ) )
			)
		);
	}
}
