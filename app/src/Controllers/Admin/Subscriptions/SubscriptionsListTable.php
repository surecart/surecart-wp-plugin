<?php

namespace CheckoutEngine\Controllers\Admin\Subscriptions;

use CheckoutEngine\Support\Currency;
use CheckoutEngine\Support\TimeDate;
use CheckoutEngine\Controllers\Admin\Tables\ListTable;
use CheckoutEngine\Models\Subscription;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class SubscriptionsListTable extends ListTable {
	// public $checkbox = true;

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
		<?php $this->search_box( __( 'Search Subscriptions', 'checkout_engine' ), 'order' ); ?>
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
			'active'   => __( 'Active', 'checkout_engine' ),
			'canceled' => __( 'Canceled', 'checkout_engine' ),
			'all'      => __( 'All', 'checkout_engine' ),
		];

		$link = \CheckoutEngine::getUrl()->index( 'subscriptions' );

		foreach ( $stati as $status => $label ) {
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
		return apply_filters( 'checkout_engine/subscription/index/links', $status_links );
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return Array
	 */
	public function get_columns() {
		return [
			// 'cb'          => '<input type="checkbox" />',
			'customer' => __( 'Customer', 'checkout_engine' ),
			'status'   => __( 'Status', 'checkout_engine' ),
			'total'    => __( 'Total', 'checkout_engine' ),
			'product'  => __( 'Product', 'checkout_engine' ),
			'created'  => __( 'Created', 'checkout_engine' ),
			// 'usage' => __( 'Usage', 'checkout_engine' ),

		];
	}

	/**
	 * Displays the checkbox column.
	 *
	 * @param Product $product The product model.
	 */
	public function column_cb( $product ) {
		?>
		<label class="screen-reader-text" for="cb-select-<?php echo esc_attr( $product['id'] ); ?>"><?php _e( 'Select comment' ); ?></label>
		<input id="cb-select-<?php echo esc_attr( $product['id'] ); ?>" type="checkbox" name="delete_comments[]" value="<?php echo esc_attr( $product['id'] ); ?>" />
			<?php
	}

	public function column_product( $subscription ) {
		if ( empty( $subscription->price->product ) ) {
			return __( 'No products', 'checkout_engine' );
		}
		return '<a href="' . esc_url( \CheckoutEngine::getUrl()->edit( 'product', $subscription->price->product->id ) ) . '">' . $subscription->price->product->name . ' - ' . $subscription->price->name . '</a>';
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
		return Subscription::where(
			[
				'status' => $this->getStatus(),
				'limit'  => $this->get_items_per_page( 'subscriptions' ),
				'page'   => $this->get_pagenum(),
			]
		)->with( [ 'customer', 'price', 'price.product', 'latest_invoice' ] )
		->paginate();
	}

	/**
	 * Get the archive query status.
	 *
	 * @return boolean|null
	 */
	public function getStatus() {
		$status = $_GET['status'] ?? null;
		if ( 'all' === $status ) {
			$status = null;
		}
		return $status ? [ sanitize_text_field( $_GET['status'] ) ] : [];
	}

	/**
	 * Handle the total column
	 *
	 * @param \CheckoutEngine\Models\Order $subscription Checkout Session Model.
	 *
	 * @return string
	 */
	public function column_total( $subscription ) {
		return '<ce-format-number type="currency" currency="' . strtoupper( esc_html( $subscription->latest_invoice->currency ?? 'usd' ) ) . '" value="' . (float) ( $subscription->latest_invoice->total_amount ?? 0 ) . '"></ce-format-number>';
	}

	/**
	 * Output the Promo Code
	 *
	 * @param Promotion $promotion Promotion model.
	 *
	 * @return string
	 */
	public function column_usage( $promotion ) {
		$max = $promotion->max_redemptions ?? '&infin;';
		ob_start();
		?>
		<?php echo \esc_html( "$promotion->times_redeemed / $max" ); ?>
		<br />
		<div style="opacity: 0.75"><?php echo \esc_html( $this->get_expiration_string( $promotion->redeem_by ) ); ?></div>
		<?php
		return ob_get_clean();
	}

	public function column_mode( $order ) {
		return $order->live_mode ? '<ce-tag type="success">' . __( 'Live', 'checkout_engine' ) . '</ce-tag>' : '<ce-tag type="warning">' . __( 'Test', 'checkout_engine' ) . '</ce-tag>';
	}

	/**
	 * Render the "Redeem By".
	 *
	 * @param string $timestamp Redeem timestamp.
	 * @return string
	 */
	public function get_expiration_string( $timestamp = '' ) {
		if ( ! $timestamp ) {
			return '';
		}
		// translators: coupon expiration date.
		return sprintf( __( 'Valid until %s', 'checkout_engine' ), date_i18n( get_option( 'date_format' ), $timestamp / 1000 ) );
	}

	public function get_price_string( $coupon = '' ) {
		if ( ! $coupon || empty( $coupon->duration ) ) {
			return;
		}
		if ( ! empty( $coupon->percent_off ) ) {
			// translators: Coupon % off.
			return sprintf( esc_html( __( '%1d%% off', 'checkout_engine' ) ), $coupon->percent_off );
		}

		if ( ! empty( $coupon->amount_off ) ) {
			// translators: Coupon amount off.
			return Currency::formatCurrencyNumber( $coupon->amount_off ) . ' <small style="opacity: 0.75;">' . strtoupper( esc_html( $coupon->currency ) ) . '</small>';
		}

		return esc_html__( 'No discount.', 'checkout_engine' );
	}

	/**
	 * Get the duration string
	 *
	 * @param Coupon|boolean $coupon Coupon object.
	 * @return string|void;
	 */
	public function get_duration_string( $coupon = '' ) {
		if ( ! $coupon || empty( $coupon->duration ) ) {
			return;
		}

		if ( 'forever' === $coupon->duration ) {
			return __( 'Forever', 'checkout_engine' );
		}
		if ( 'repeating' === $coupon->duration ) {
			// translators: number of months.
			return sprintf( __( 'For %d months', 'checkout_engine' ), $coupon->duration_in_months ?? 1 );
		}

		return __( 'Once', 'checkout_engine' );
	}

	/**
	 * Handle the status
	 *
	 * @param \CheckoutEngine\Models\Price $product Product model.
	 *
	 * @return string
	 */
	public function column_status( $subscription ) {

		switch ( $subscription->status ) {
			case 'active':
				$status = '<ce-tag type="success">' . __( 'Active', 'checkout_engine' ) . '</ce-tag>';
				break;
			case 'canceled':
				$status = '<ce-tag type="warning">' . __( 'Canceled', 'checkout_engine' ) . '</ce-tag>';
				break;
			case 'trialing':
				$status = '<ce-tag type="primary">' . __( 'Trialing', 'checkout_engine' ) . '</ce-tag>';
				break;
			case 'draft':
				$status = '<ce-tag>' . __( 'Draft', 'checkout_engine' ) . '</ce-tag>';
				break;
			default:
				$status = '<ce-tag>' . $subscription->status . '</ce-tag>';
				break;
		}

		if ( ! $subscription->live_mode ) {
			$status .= ' <ce-tag type="warning">' . __( 'Test', 'checkout_engine' ) . '</ce-tag>';
		}

		return $status;
	}

	/**
	 * Name of the coupon
	 *
	 * @param \CheckoutEngine\Models\Promotion $promotion Promotion model.
	 *
	 * @return string
	 */
	public function column_customer( $subscription ) {
		ob_start();
		$name = $subscription->customer->name;
		if ( ! $name ) {
			$name = $subscription->customer->email;
		}
		?>
		<a class="row-title" aria-label="<?php echo esc_attr__( 'Edit Subscription', 'checkout_engine' ); ?>" href="<?php echo esc_url( \CheckoutEngine::getUrl()->edit( 'subscription', $subscription->id ) ); ?>">
			<?php echo esc_html_e( $name ?? __( 'No name provided', 'checkout_engine' ) ); ?>
		</a>

		<?php
		echo $this->row_actions(
			[
				'edit' => '<a href="' . esc_url( \CheckoutEngine::getUrl()->edit( 'subscription', $subscription->id ) ) . '" aria-label="' . esc_attr( 'Edit Subscription', 'checkout_engine' ) . '">' . __( 'Edit', 'checkout_engine' ) . '</a>',
			],
		);
		?>
		<?php
		return ob_get_clean();
	}
}
