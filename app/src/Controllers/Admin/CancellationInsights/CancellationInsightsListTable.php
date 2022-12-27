<?php

namespace SureCart\Controllers\Admin\CancellationInsights;

use SureCart\Support\Currency;
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

	public function search() {
		?>
	<form class="search-form"
		method="get">
		<?php $this->search_box( __( 'Search Subscriptions', 'surecart' ), 'order' ); ?>
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
			'customer'            => __( 'Customer', 'surecart' ),
			'product'             => __( 'Product', 'surecart' ),
			'date'                => __( 'Date', 'surecart' ),
			'cancellation_reason' => __( 'Cancellation Reason', 'surecart' ),
			'preserved'           => __( 'Preserved', 'surecart' ),
			'comment'             => __( 'Comment', 'surecart' ),
		];
	}
	
	protected function get_views() {
		return [ 'all'      => __( 'All Cancellations', 'surecart' )];
	}

	public function column_product( $subscription ) {
		if ( empty( $subscription->price->product ) ) {
			return __( 'No product', 'surecart' );
		}
		return '<a href="' . esc_url( \SureCart::getUrl()->edit( 'product', $subscription->price->product->id ) ) . '">' . $subscription->price->product->name . '</a>';
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
		return CancellationAct::with( [ 'subscription', 'subscription.customer', 'cancellation_reason' ] )
		->paginate(
			[
				'per_page' => $this->get_items_per_page( 'subscriptions' ),
				'page'     => $this->get_pagenum(),
			]
		);
	}

	public function column_cancellation_reason( $act ) {
		return $act->cancellation_reason->label ?? '-';
	}

	/**
	 * Get the archive query status.
	 *
	 * @param \SureCart\Models\CancellationAct $act Cancellation act model.
	 *
	 * @return string
	 */
	public function column_customer( $act ) {
		ob_start();
		$name = $act->subscription->customer->name ?? $act->subscription->customer->email ?? __( 'No name provided', 'surecart' );
		?>
		<?php echo esc_html( $name ); ?>

		<?php
		// echo $this->row_actions(
		// [
		// 'edit' => '<a href="' . esc_url( \SureCart::getUrl()->show( 'subscription', $subscription->id ) ) . '" aria-label="' . esc_attr( 'Edit Subscription', 'surecart' ) . '">' . __( 'Edit', 'surecart' ) . '</a>',
		// ],
		// );
		?>
		<?php
		return ob_get_clean();
	}
}
