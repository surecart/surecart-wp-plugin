<?php

namespace SureCart\Controllers\Admin\Orders;

use SureCart\Support\TimeDate;
use SureCart\Models\Order;
use SureCart\Controllers\Admin\Tables\ListTable;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class OrdersListTable extends ListTable {
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
	 * Show any integrations.
	 *
	 * @param \SureCart\Models\Order $order Order.
	 */
	public function column_integrations( $order ) {
		$output = '';

		// loop through each purchase.
		if ( ! empty( $order->checkout->purchases->data ) ) {
			foreach ( $order->checkout->purchases->data as $purchase ) {
				$output .= $this->productIntegrationsList( $purchase->product );
			}
		}

		return $output ? $output : '-';
	}

	/**
	 * @global int $post_id
	 * @global string $comment_status
	 * @global string $comment_type
	 */
	protected function get_views() {
		$stati = [
			'paid'           => __( 'Paid', 'surecart' ),
			'processing'     => __( 'Processing', 'surecart' ),
			'payment_failed' => __( 'Failed', 'surecart' ),
			'all'            => __( 'All', 'surecart' ),
		];

		$link = \SureCart::getUrl()->index( 'orders' );

		foreach ( $stati as $status => $label ) {
			$current_link_attributes = '';

			if ( ! empty( $_GET['status'] ) ) {
				if ( $status === $_GET['status'] ) {
					$current_link_attributes = ' class="current" aria-current="page"';
				}
			} elseif ( 'paid' === $status ) {
				$current_link_attributes = ' class="current" aria-current="page"';
			}

			$link = add_query_arg( 'status', $status, $link );

			$status_links[ $status ] = "<a href='$link'$current_link_attributes>" . $label . '</a>';
		}

		// filter links
		return apply_filters( 'sc_order_status_links', $status_links );
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return Array
	 */
	public function get_columns() {
		return [
			// 'cb'          => '<input type="checkbox" />',
			'order'        => __( 'Order', 'surecart' ),
			'status'       => __( 'Status', 'surecart' ),
			'method'       => __( 'Method', 'surecart' ),
			'integrations' => __( 'Integrations', 'surecart' ),
			'total'        => __( 'Total', 'surecart' ),
			'created'      => __( 'Date', 'surecart' ),
			'mode'         => '',
		];
	}

	/**
	 * Displays the checkbox column.
	 *
	 * @param Product $product The product model.
	 */
	public function column_cb( $product ) {
		?>
		<label class="screen-reader-text" for="cb-select-<?php echo esc_attr( $product['id'] ); ?>"><?php _e( 'Select comment', 'surecart' ); ?></label>
		<input id="cb-select-<?php echo esc_attr( $product['id'] ); ?>" type="checkbox" name="delete_comments[]" value="<?php echo esc_attr( $product['id'] ); ?>" />
			<?php
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
		return array( 'title' => array( 'title', false ) );
	}

	/**
	 * Get the table data
	 *
	 * @return Array
	 */
	protected function table_data() {
		return Order::where(
			[
				'status' => $this->getStatus(),
				'query'  => $this->get_search_query(),
			]
		)->with( [ 'checkout', 'checkout.charge', 'checkout.customer', 'checkout.payment_method', 'checkout.purchases', 'payment_method.card', 'payment_method.payment_instrument', 'payment_method.paypal_account', 'payment_method.bank_account' ] )
		->paginate(
			[
				'per_page' => $this->get_items_per_page( 'orders' ),
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
		$status = sanitize_text_field( wp_unslash( $_GET['status'] ?? 'paid' ) );
		if ( 'paid' === $status ) {
			return [ 'paid' ];
		}
		if ( 'payment_failed' === $status ) {
			return [ 'payment_failed' ];
		}
		if ( 'processing' === $status ) {
			return [ 'processing' ];
		}
		if ( 'all' === $status ) {
			return [];
		}
		return $status ? [ esc_html( $status ) ] : [];
	}

	/**
	 * Handle the total column
	 *
	 * @param \SureCart\Models\Order $order The order model.
	 *
	 * @return string
	 */
	public function column_total( $order ) {
		return '<sc-format-number type="currency" currency="' . strtoupper( esc_html( $order->checkout->currency ) ) . '" value="' . (float) $order->checkout->amount_due . '"></sc-format-number>';
	}

	/**
	 * Show the payment method for the order.
	 *
	 * @param \SureCart\Models\Order $order The order model.
	 *
	 * @return string
	 */
	public function column_method( $order ) {
		ob_start();
		?>
			<sc-payment-method id="sc-method-<?php echo esc_attr( $order->id ); ?>"></sc-payment-method>
			<script>
				document.getElementById('sc-method-<?php echo esc_attr( $order->id ); ?>').paymentMethod = <?php echo wp_json_encode( $order->checkout->payment_method ); ?>;
			</script>
		<?php
		return ob_get_clean();
	}

	/**
	 * Handle the status
	 *
	 * @param \SureCart\Models\Order $order Order Model.
	 *
	 * @return string
	 */
	public function column_status( $order ) {
		if ( ! empty( $order->checkout->charge->fully_refunded ) ) {
			return '<sc-tag type="danger">' . __( 'Refunded', 'surecart' ) . '</sc-tag>';
		}

		if ( ! empty( $order->checkout->payment_intent->processor_type ) && 'paypal' === $order->checkout->payment_intent->processor_type ) {
			if ( 'requires_approval' === $order->status ) {
				return '<sc-tooltip text="' . __( 'Paypal is taking a closer look at this payment. It’s required for some payments and normally takes up to 3 business days.', 'surecart' ) . '" type="warning"><sc-order-status-badge status="' . esc_attr( $order->status ) . '"></sc-order-status-badge></sc-tooltip>';
			}
		}

		return '<sc-order-status-badge status="' . esc_attr( $order->status ) . '"></sc-order-status-badge>';
	}

	/**
	 * Name of the coupon
	 *
	 * @param \SureCart\Models\Promotion $promotion Promotion model.
	 *
	 * @return string
	 */
	public function column_order( $order ) {
		ob_start();
		?>
		<a class="row-title" aria-label="<?php echo esc_attr__( 'Edit Order', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'order', $order->id ) ); ?>">
			#<?php echo sanitize_text_field( $order->number ?? $order->id ); ?>
		</a>
		<br />
		<a  aria-label="<?php echo esc_attr__( 'Edit Order', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'order', $order->id ) ); ?>">
			<?php
			// translators: Customer name.
			echo sprintf( esc_html__( 'By %s', 'surecart' ), esc_html( $order->checkout->customer->name ?? $order->checkout->customer->email ) );
			?>
		</a>
		<?php

		return ob_get_clean();
	}
}
