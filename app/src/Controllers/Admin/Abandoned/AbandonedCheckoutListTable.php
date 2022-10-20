<?php

namespace SureCart\Controllers\Admin\Abandoned;

use SureCart\Controllers\Admin\Tables\ListTable;
use SureCart\Models\AbandonedCheckout;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class AbandonedCheckoutListTable extends ListTable {
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
				'per_page'    => $this->get_items_per_page( 'abandoned_checkout' ),
			]
		);

		$this->items = $query->data;
	}

	protected function get_views() {
		$stati = [
			'all'       => __( 'All', 'surecart' ),
			'recovered' => __( 'Recovered', 'surecart' ),
			'notified'  => __( 'Notified', 'surecart' ),
		];

		$link = \SureCart::getUrl()->index( 'abandoned-checkout' );

		foreach ( $stati as $status => $label ) {
			$current_link_attributes = '';

			if ( ! empty( $_GET['status'] ) ) {
				if ( sanitize_text_field( wp_unslash( $_GET['status'] ) ) === $status ) {
					$current_link_attributes = ' class="current" aria-current="page"';
				}
			} elseif ( 'all' === $status ) {
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
		return apply_filters( 'abandoned_order_status_links', $status_links );
	}

	public function search() {
		?>
		<form class="search-form"
			method="get">
			<?php $this->search_box( __( 'Search Abanonded Orders', 'surecart' ), 'abandoned_order' ); ?>
			<input type="hidden"
				name="id"
				value="1" />
		</form>
		<?php
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return Array
	 */
	public function get_columns() {
		return [
			'placed_by'       => __( 'Placed By', 'surecart' ),
			'date'            => __( 'Date', 'surecart' ),
			'email_status'    => __( 'Email Status', 'surecart' ),
			'recovery_status' => __( 'Recovery Status', 'surecart' ),
			'total'           => __( 'Total', 'surecart' ),
		];
	}

	/**
	 * Get the table data
	 *
	 * @return Array
	 */
	protected function table_data() {
		return AbandonedCheckout::where(
			[
				'status' => $this->getStatus(),
			]
		)
		->with( [ 'latest_recoverable_checkout', 'customer' ] )
		->paginate(
			[
				'per_page' => $this->get_items_per_page( 'abandoned-checkouts' ),
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
		$status = sanitize_text_field( wp_unslash( $_GET['status'] ?? 'all' ) );
		if ( 'all' === $status ) {
			return [ 'not_notified', 'notified' ];
		}
		return $status ? [ esc_html( $status ) ] : [];
	}

	/**
	 * Handle the total column
	 *
	 * @param \SureCart\Models\AbandonedCheckout $checkout Checkout Session Model.
	 *
	 * @return string
	 */
	public function column_total( $abandoned ) {
		return '<sc-format-number type="currency" currency="' . strtoupper( esc_html( $abandoned->latest_recoverable_checkout->currency ?? 'usd' ) ) . '" value="' . (float) $abandoned->latest_recoverable_checkout->total_amount . '"></sc-format-number>';
	}

	/**
	 * Handle the total column
	 *
	 * @param \SureCart\Models\AbandonedCheckout $abandoned Abandoned checkout model.
	 *
	 * @return string
	 */
	public function column_date( $abandoned ) {
		return isset( $abandoned->created_at ) ? '<sc-format-date date="' . (int) $abandoned->created_at . '" type="timestamp" month="short" day="numeric" year="numeric" hour="numeric" minute="numeric"></sc-format-date>' : '--';
	}

	/**
	 * Handle the status
	 *
	 * @param \SureCart\Models\AbandonedCheckout $abandoned Abandoned checkout session.
	 *
	 * @return string
	 */
	public function column_email_status( $abandoned ) {
		return 'notified' === $abandoned->status ? '<sc-tag type="success">' . __( 'Sent', 'surecart' ) . '</sc-tag>' : '<sc-tag>' . __( 'Not Sent', 'surecart' ) . '</sc-tag>';
	}


	/**
	 * Handle the status
	 *
	 * @param \SureCart\Models\AbandonedCheckout $abandoned Abandoned checkout session.
	 *
	 * @return string
	 */
	public function column_recovery_status( $abandoned ) {
		return 'recovered' === $abandoned->status ? '<sc-tag type="success">' . __( 'Recovered', 'surecart' ) . '</sc-tag>' : '<sc-tag>' . __( 'Not Recovered', 'surecart' ) . '</sc-tag>';
	}

	/**
	 * Email of customer
	 *
	 * @param \SureCart\Models\AbandonedCheckout $abandoned Abandoned checkout model.
	 *
	 * @return string
	 */
	public function column_placed_by( $abandoned ) {
		ob_start();
		?>
		<a  class="row-title" aria-label="<?php echo esc_attr__( 'Edit Order', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'abandoned-checkout', $abandoned->id ) ); ?>">
			<?php
			// translators: Customer name.
			echo sprintf( esc_html__( 'By %s', 'surecart' ), esc_html( $abandoned->customer->name ?? $abandoned->customer->email ) );
			?>
		</a>
		<br />
		<a aria-label="<?php echo esc_attr__( 'View Checkout', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'abandoned-checkout', $abandoned->id ) ); ?>">
			<?php echo esc_attr__( 'View Checkout', 'surecart' ); ?>
		</a>
		<?php

		return ob_get_clean();
	}
}
