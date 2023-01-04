<?php

namespace SureCart\Controllers\Admin\CancellationInsights;

use SureCart\Controllers\Admin\Tables\ListTable;
use SureCart\Models\CancellationAct;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class CancellationInsightsListTable extends ListTable {
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
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return Array
	 */
	public function get_columns() {
		return [
			'customer'            => __( 'Customer', 'surecart' ),
			'plan'                => __( 'Plan', 'surecart' ),
			'cancellation_reason' => __( 'Cancellation Reason', 'surecart' ),
			'comment'             => __( 'Comment', 'surecart' ),
			'coupon'              => __( 'Coupon', 'surecart' ),
			'status'              => __( 'Status', 'surecart' ),
			'date'                => __( 'Date', 'surecart' ),
		];
	}

	/**
	 * The subscription product.
	 *
	 * @param \SureCart\Models\CancellationAct $act Cancellation reason model.
	 *
	 * @return string
	 */
	public function column_plan( $act ) {
		if ( empty( $act->subscription->price->product ) ) {
			return __( 'No product', 'surecart' );
		}
		return '<a href="' . esc_url( \SureCart::getUrl()->show( 'subscription', $act->subscription->id ) ) . '">' . $act->subscription->price->product->name . '</a>';
	}

	/**
	 * The subscription product.
	 *
	 * @param \SureCart\Models\CancellationAct $act Cancellation reason model.
	 *
	 * @return string
	 */
	public function column_date( $act ) {
		return '<sc-format-date date="' . (int) $act->performed_at . '" type="timestamp" month="short" day="numeric" year="numeric" hour="numeric" minute="numeric"></sc-format-date>';
	}

	/**
	 * We only have one default view.
	 */
	protected function get_views() {
		return [ 'all' => __( 'Cancellation Acts', 'surecart' ) ];
	}

	/**
	 * Get the table data
	 *
	 * @return Object
	 */
	protected function table_data() {
		$live_mode = 'false' === sanitize_text_field( wp_unslash( $_GET['live_mode'] ?? '' ) ) ? false : true;
		return CancellationAct::where( [ 'live_mode' => (bool) $live_mode ] )->with( [ 'subscription', 'subscription.customer', 'cancellation_reason', 'subscription.price', 'price.product' ] )
		->paginate(
			[
				'per_page' => $this->get_items_per_page( 'subscriptions' ),
				'page'     => $this->get_pagenum(),
			]
		);
	}

	/**
	 * Nothing found.
	 *
	 * @return void
	 */
	public function no_items() {
		echo esc_html_e( 'No cancellation acts.', 'surecart' );
	}

	/**
	 * The cancellation reason.
	 *
	 * @param \SureCart\Models\CancellationAct $act Cancellation act.
	 *
	 * @return string
	 */
	public function column_cancellation_reason( $act ) {
		return $act->cancellation_reason->label ?? '-';
	}

	/**
	 * The customer.
	 *
	 * @param \SureCart\Models\CancellationAct $act Cancellation act model.
	 *
	 * @return string
	 */
	public function column_customer( $act ) {
		ob_start();
		?>
		<a class="row-title" aria-label="<?php echo esc_attr( 'Edit Customer', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'customers', $act->subscription->customer->id ) ); ?>">
			<?php echo wp_kses_post( $act->subscription->customer->name ?? $act->subscription->customer->email ?? esc_html__( 'No name provided', 'surecart' ) ); ?>
		</a>

		<?php
		echo $this->row_actions(
			[
				'edit' => '<a href="' . esc_url( \SureCart::getUrl()->edit( 'customers', $act->subscription->customer->id ) ) . '" aria-label="' . esc_attr( 'View Customer', 'surecart' ) . '">' . esc_html__( 'View Customer', 'surecart' ) . '</a>',
			],
		);
		?>

		<?php
		return ob_get_clean();
	}

	/**
	 * Was the coupon applied?
	 *
	 * @param \SureCart\Models\CancellationAct $act Cancellation act model.
	 *
	 * @return string
	 */
	public function column_coupon( $act ) {
		if ( $act->coupon_applied ) {
			return '<sc-tag type="info">' . esc_html__( 'Coupon Applied', 'surecart' ) . '</sc-tag>';
		}
		return '-';
	}

	/**
	 * Cancellation comment.
	 *
	 * @param \SureCart\Models\CancellationAct $act Cancellation act model.
	 *
	 * @return string
	 */
	public function column_comment( $act ) {
		return $act->comment ?? '-';
	}

	/**
	 * The status
	 *
	 * @param \SureCart\Models\CancellationAct $act Cancellation act model.
	 *
	 * @return string
	 */
	public function column_status( $act ) {
		if ( $act->preserved ) {
			return '<sc-tag type="success">' . esc_html__( 'Preserved', 'surecart' ) . '</sc-tag>';
		}
		if ( 'canceled' === $act->subscription->status ) {
			return '<sc-tag type="danger">' . esc_html__( 'Cancelled', 'surecart' ) . '</sc-tag>';
		}
		if ( $act->subscription->cancel_at_period_end ) {
			return '<sc-tag type="warning">' . esc_html__( 'Will Cancel', 'surecart' ) . '</sc-tag>';
		}
		if ( 'active' === $act->subscription->status ) {
			return '<sc-tag type="success">' . esc_html__( 'Active', 'surecart' ) . '</sc-tag>';
		}
		return '-';
	}
}
