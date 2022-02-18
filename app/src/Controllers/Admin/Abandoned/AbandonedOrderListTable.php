<?php

namespace CheckoutEngine\Controllers\Admin\Abandoned;

use CheckoutEngine\Support\TimeDate;
use CheckoutEngine\Controllers\Admin\Tables\ListTable;
use CheckoutEngine\Models\AbandonedOrder;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class AbandonedOrderListTable extends ListTable {
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
				'per_page'    => $this->get_items_per_page( 'abandoned_orders' ),
			]
		);

		$this->items = $query->data;
	}

		/**
		 * @global int $post_id
		 * @global string $comment_status
		 * @global string $comment_type
		 */
	protected function get_views() {
		$stati = [
			'all'       => __( 'All', 'checkout_engine' ),
			'recovered' => __( 'Recovered', 'checkout_engine' ),
			'notified'  => __( 'Notified', 'checkout_engine' ),
		];

		$link = \CheckoutEngine::getUrl()->index( 'abandoned_orders' );

		foreach ( $stati as $status => $label ) {
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
		<?php $this->search_box( __( 'Search Abanonded Orders', 'checkout_engine' ), 'abandoned_order' ); ?>
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
			'email'  => __( 'Email', 'checkout_engine' ),
			'date'   => __( 'Date', 'checkout_engine' ),
			'status' => __( 'Status', 'checkout_engine' ),
			'total'  => __( 'Total', 'checkout_engine' ),
		];
	}

	/**
	 * Get the table data
	 *
	 * @return Array
	 */
	protected function table_data() {
		return AbandonedOrder::where(
			[
				'status' => $this->getStatus(),
			]
		)
		->with( [ 'latest_order', 'customer' ] )
		->paginate(
			[
				'per_page' => $this->get_items_per_page( 'coupons' ),
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
		$status = $_GET['status'] ?? 'all';
		if ( $status === 'all' ) {
			return [ 'not_notified', 'notified' ];
		}
		return $status ? [ sanitize_text_field( $status ) ] : [];
	}

	/**
	 * Handle the total column
	 *
	 * @param \CheckoutEngine\Models\AbandonedOrder $checkout Checkout Session Model.
	 *
	 * @return string
	 */
	public function column_total( $abandoned ) {
		return '<ce-format-number type="currency" currency="' . strtoupper( esc_html( $abandoned->latest_order->currency ?? 'usd' ) ) . '" value="' . (float) $abandoned->latest_order->total_amount . '"></ce-format-number>';
	}

	/**
	 * Handle the total column
	 *
	 * @param \CheckoutEngine\Models\AbandonedOrder $abandoned Abandoned checkout model.
	 *
	 * @return string
	 */
	public function column_date( $abandoned ) {
		return sprintf(
			'<time datetime="%1$s" title="%2$s">%3$s</time>',
			esc_attr( $abandoned->latest_order->updated_at ),
			esc_html( TimeDate::formatDateAndTime( $abandoned->latest_order->updated_at ) ),
			esc_html( TimeDate::humanTimeDiff( $abandoned->latest_order->updated_at ) )
		);
	}

	/**
	 * Handle the status
	 *
	 * @param \CheckoutEngine\Models\AbandonedOrder $abandoned Abandoned checkout session.
	 *
	 * @return string
	 */
	public function column_status( $abandoned ) {
		switch ( $abandoned->status ) {
			case 'not_notified':
				return '<ce-tag type="danger">' . __( 'Not Notified', 'checkout_engine' ) . '</ce-tag>';
			case 'notified':
				return '<ce-tag type="warning">' . __( 'Notified', 'checkout_engine' ) . '</ce-tag>';
			case 'recovered':
				return '<ce-tag type="success">' . __( 'Recovered', 'checkout_engine' ) . '</ce-tag>';
		}
		return '<ce-tag>' . $abandoned->status . '</ce-tag>';
	}

	/**
	 * Email of customer
	 *
	 * @param \CheckoutEngine\Models\AbandonedOrder $abandoned Abandoned checkout model.
	 *
	 * @return string
	 */
	public function column_email( $abandoned ) {
		return $abandoned->customer->email ?? __( 'None', 'checkout_engine' );
	}
}
