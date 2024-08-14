<?php

namespace SureCart\Controllers\Admin\Invoices;

use SureCart\Controllers\Admin\Tables\ListTable;
use SureCart\Models\Customer;
use SureCart\Models\Invoice;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class InvoicesListTable extends ListTable {
	public $checkbox = true;

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
			$this->items = [];
			return;
		}

		$this->set_pagination_args(
			[
				'total_items' => $query->pagination->count,
				'per_page'    => $this->get_items_per_page( 'invoices' ),
			]
		);

		$this->items = $query->data;
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return array
	 */
	public function get_columns() {
		return [
			'invoice'    => __( 'Invoice', 'surecart' ),
			'due_date'   => __( 'Due Date', 'surecart' ),
			'issue_date' => __( 'Issue Date', 'surecart' ),
			'status'     => __( 'Status', 'surecart' ),
			'customer'   => __( 'Customer', 'surecart' ),
			'method'     => __( 'Method', 'surecart' ),
			'total'      => __( 'Total', 'surecart' ),
			'mode'       => '',
		];
	}

	/**
	 * Displays the checkbox column.
	 *
	 * @param Invoice $invoice The invoice model.
	 */
	public function column_cb( $invoice ) {
		?>
		<label class="screen-reader-text" for="cb-select-<?php echo esc_attr( $invoice['id'] ); ?>"><?php _e( 'Select comment', 'surecart' ); ?></label>
		<input id="cb-select-<?php echo esc_attr( $invoice['id'] ); ?>" type="checkbox" name="delete_comments[]" value="<?php echo esc_attr( $invoice['id'] ); ?>" />
		<?php
	}

	/**
	 * Show the payment method for the invoice.
	 *
	 * @param \SureCart\Models\Invoice $invoice Invoice model.
	 *
	 * @return string
	 */
	public function column_method( $invoice ) {
		if ( ! empty( $invoice->checkout->payment_intent->processor_type ) && 'paypal' === $invoice->checkout->payment_intent->processor_type ) {
			return '<sc-icon name="paypal" style="font-size: 56px; line-height:1; height: 28px;"></sc-icon>';
		}
		if ( ! empty( $invoice->checkout->payment_intent->payment_method->card->brand ) ) {
			return '<sc-cc-logo style="font-size: 32px; line-height:1;" brand="' . esc_html( $invoice->checkout->payment_intent->payment_method->card->brand ) . '"></sc-cc-logo>';
		}

		return $invoice->checkout->payment_intent->processor_type ?? '-';
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
	 * Define the sortable columns
	 *
	 * @return array
	 */
	public function get_sortable_columns() {
		return array( 'title' => array( 'title', false ) );
	}

	/**
	 * Get the table data
	 *
	 * @return array
	 */
	protected function table_data() {
		$status = $this->getStatus();
		$where  = array(
			'live_mode' => 'false' !== sanitize_text_field( wp_unslash( $_GET['live_mode'] ?? '' ) ), // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			'query'     => $this->get_search_query(),
		);

		if ( $status ) {
			$where['status'] = [ $status ];
		}

		// Check if there is any sc_collection in the query, then filter it.
		if ( ! empty( $_GET['sc_customer'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$where['customer_ids'] = array( sanitize_text_field( wp_unslash( $_GET['sc_customer'] ) ) );  // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}

		return Invoice::where( $where )
		->with( [ 'charge', 'invoice.checkout', 'checkout.order', 'checkout.customer', 'payment_intent', 'payment_intent.payment_method', 'payment_method.card' ] )
		->paginate(
			[
				'per_page' => $this->get_items_per_page( 'invoices' ),
				'page'     => $this->get_pagenum(),
			]
		);
	}

	/**
	 * @global int $post_id
	 * @global string $comment_status
	 * @global string $comment_type
	 */
	protected function get_views() {
		$statuses = [
			'all'   => __( 'All', 'surecart' ),
			'paid'  => __( 'Paid', 'surecart' ),
			'draft' => __( 'draft', 'surecart' ),
			'open'  => __( 'Open', 'surecart' ),
		];

		$link         = \SureCart::getUrl()->index( 'invoices' );
		$status_links = [];

		foreach ( $statuses as $status => $label ) {
			$current_link_attributes = '';

			if ( ! empty( $_GET['status'] ) ) {
				if ( $status === $_GET['status'] ) {
					$current_link_attributes = ' class="current" aria-current="page"';
				}
			} elseif ( 'all' === $status ) {
				$current_link_attributes = ' class="current" aria-current="page"';
			}

			$link = add_query_arg( 'status', $status, $link );

			$status_links[ $status ] = "<a href='$link'$current_link_attributes>" . $label . '</a>';
		}

		// filter links.
		return apply_filters( 'sc_invoice_status_links', $status_links );
	}

	/**
	 * Get the query status.
	 *
	 * @return array
	 */
	public function getStatus() {
		$status = sanitize_text_field( wp_unslash( $_GET['status'] ?? 'all' ) );  //TODO:change it to open.
		if ( 'all' === $status ) {
			return [];
		}
		return $status ? [ esc_html( $status ) ] : [];
	}

	/**
	 * Handle the total column
	 *
	 * @param \SureCart\Models\Invoice $invoice Invoice Model.
	 *
	 * @return string
	 */
	public function column_total( $invoice ) {
		return '<sc-format-number type="currency" currency="' . strtoupper( esc_html( $invoice->checkout->currency ?? 'u' ) ) . '" value="' . (float) $invoice->checkout->total_amount . '"></sc-format-number>';
	}

	/**
	 * Handle the total column
	 *
	 * @param \SureCart\Models\Invoice $invoice Invoice model.
	 *
	 * @return string
	 */
	public function column_date( $invoice ) {
		return '<sc-format-date date="' . (int) $invoice->updated_at . '" type="timestamp" month="short" day="numeric" year="numeric" hour="numeric" minute="numeric"></sc-format-date>';
	}

	/**
	 * Handle invoice due date.
	 *
	 * @param Invoice $invoice Invoice model.
	 *
	 * @return string
	 */
	public function column_due_date( $invoice ) {
		return $invoice->due_date ? '<sc-format-date date="' . (int) $invoice->due_date . '" type="timestamp" month="short" day="numeric" year="numeric" hour="numeric" minute="numeric"></sc-format-date>' : '-';
	}

	/**
	 * Handle invoice issue date.
	 *
	 * @param Invoice $invoice Invoice model.
	 *
	 * @return string
	 */
	public function column_issue_date( $invoice ) {
		return $invoice->issue_date ? '<sc-format-date date="' . (int) $invoice->issue_date . '" type="timestamp" month="short" day="numeric" year="numeric" hour="numeric" minute="numeric"></sc-format-date>' : '-';
	}

	/**
	 * Show customers as tag.
	 *
	 * @param Invoice $invoice The invoice model.
	 */
	public function column_customer( $invoice ) {
		$customer = $invoice->checkout->customer ?? null;

		if ( empty( $customer ) ) {
			return '-';
		}

		$url = add_query_arg( 'sc_customer', $customer->id, admin_url( 'admin.php?page=sc-invoices' ) );

		if ( isset( $_GET['live_mode'] ) ) {
			$url = add_query_arg( 'live_mode', sanitize_text_field( wp_unslash( $_GET['live_mode'] ) ), $url );
		}

		if ( ! empty( $_GET['status'] ) ) {
			$url = add_query_arg( 'status', sanitize_text_field( wp_unslash( $_GET['status'] ) ), $url );
		}

		return '<a href="' . esc_url( $url ) . '">' . $customer->name . '</a>';
	}

	/**
	 * Render the "Redeem By"
	 *
	 * @param string $timestamp Redeem timestamp.
	 * @return string
	 */
	public function get_expiration_string( $timestamp = '' ) {
		if ( ! $timestamp ) {
			return '';
		}
		// translators: coupon expiration date.
		return sprintf( __( 'Valid until %s', 'surecart' ), date_i18n( get_option( 'date_format' ), $timestamp / 1000 ) );
	}

	/**
	 * Handle the status.
	 *
	 * @param \SureCart\Models\Invoice $invoice Invoice Model.
	 *
	 * @return string
	 */
	public function column_status( $invoice ) {
		if ( ! empty( $invoice->charge->fully_refunded ) ) {
			return '<sc-tag type="danger">' . __( 'Refunded', 'surecart' ) . '</sc-tag>';
		}
		return '<sc-order-status-badge status="' . esc_attr( $invoice->status ) . '"></sc-order-status-badge>';
	}

	/**
	 * Handle Invoice column.
	 *
	 * @param \SureCart\Models\Promotion $promotion Promotion model.
	 *
	 * @return string
	 */
	public function column_invoice( $invoice ) {
		ob_start();
		?>
		<a class="row-title" aria-label="<?php echo esc_attr__( 'Edit Invoice', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'invoice', $invoice->id ) ); ?>">
			<?php echo ! empty( $invoice->checkout->order->number ) ? '#' . esc_html( $invoice->checkout->order->number ) : esc_html_e( '(draft)', 'surecart' ); ?>
		</a>
		<?php

		return ob_get_clean();
	}

	/**
	 * Handle the mode column.
	 *
	 * @param Invoice $invoice Invoice model.
	 *
	 * @return string
	 */
	public function column_mode( $invoice ) {
		return empty( $invoice->checkout->live_mode ) ? '<sc-tag type="warning">' . __( 'Test', 'surecart' ) . '</sc-tag>' : '';
	}

	/**
	 * Displays extra table navigation.
	 *
	 * @param string $which Top or bottom placement.
	 */
	protected function extra_tablenav( $which ) {
		?>
		<input type="hidden" name="page" value="sc-invoices" />

		<?php if ( ! empty( $_GET['status'] ) ) : ?>
			<input type="hidden" name="status" value="<?php echo esc_attr( $_GET['status'] ); ?>" />
		<?php endif; ?>

		<?php if ( ! empty( $_GET['live_mode'] ) ) : ?>
			<input type="hidden" name="live_mode" value="<?php echo esc_attr( $_GET['live_mode'] ); ?>" />
		<?php endif; ?>

		<div class="alignleft actions">
		<?php
		if ( 'top' === $which ) {
			ob_start();
			$this->customers_dropdown();

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
			do_action( 'restrict_manage_invoices', $this->screen->post_type, $which );

			$output = ob_get_clean();

			if ( ! empty( $output ) ) {
				echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				submit_button( __( 'Filter' ), '', 'filter_action', false, array( 'id' => 'filter-by-fulfillment-submit' ) );
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
		do_action( 'manage_invoices_extra_tablenav', $which );
	}

	/**
	 * Displays a a dropdown to filter by customers.
	 *
	 * @access protected
	 */
	protected function customers_dropdown() {
		/**
		 * Filters whether to remove the 'Formats' drop-down from the product list table.
		 *
		 * @param bool $disable Whether to disable the drop-down. Default false.
		 */
		if ( apply_filters( 'surecart/disable_customers_dropdown', false ) ) {
			return;
		}

		// Get the customers for specfic live or test mode.
		$customers = Customer::where(
			[
				'live_mode' => 'false' !== sanitize_text_field( wp_unslash( $_GET['live_mode'] ?? '' ) ), // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			]
		)->get();
		$displayed_customer = isset( $_GET['sc_customer'] ) ? sanitize_text_field( wp_unslash( $_GET['sc_customer'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		?>

		<label for="filter-by-customer" class="screen-reader-text">
			<?php esc_html_e( 'Filter by Customer', 'surecart' ); ?>
		</label>
		<select name="sc_customer" id="filter-by-customer">
			<option <?php selected( $displayed_customer, '' ); ?> value=""><?php esc_html_e( 'All Customers', 'surecart' ); ?></option>
			<?php foreach ( $customers as $customer ) : ?>
				<option <?php selected( $displayed_customer, $customer->id ); ?> value="<?php echo esc_attr( $customer->id ); ?>">
					<?php echo esc_html( $customer->first_name ); ?>
				</option>
			<?php endforeach; ?>
		</select>
		<?php
	}
}
