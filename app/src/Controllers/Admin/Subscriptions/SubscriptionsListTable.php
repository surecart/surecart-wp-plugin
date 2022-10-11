<?php

namespace SureCart\Controllers\Admin\Subscriptions;

use SureCart\Support\Currency;
use SureCart\Controllers\Admin\Tables\ListTable;
use SureCart\Models\Subscription;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class SubscriptionsListTable extends ListTable {
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
	 * @global int $post_id
	 * @global string $comment_status
	 * @global string $comment_type
	 */
	protected function get_views() {
		$stati = [
			'all'      => __( 'All', 'surecart' ),
			'active'   => __( 'Active', 'surecart' ),
			'canceled' => __( 'Canceled', 'surecart' ),
		];

		$link = \SureCart::getUrl()->index( 'subscriptions' );

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
		return apply_filters( 'surecart/subscription/index/links', $status_links );
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return Array
	 */
	public function get_columns() {
		return [
			'customer'           => __( 'Customer', 'surecart' ),
			'status'             => __( 'Status', 'surecart' ),
			'plan'               => __( 'Plan', 'surecart' ),
			'remaining_payments' => __( 'Remaining Payments', 'surecart' ),
			'product'            => __( 'Product', 'surecart' ),
			'integrations'       => __( 'Integrations', 'surecart' ),
			'created'            => __( 'Created', 'surecart' ),
			'mode'               => '',
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

	public function column_product( $subscription ) {
		if ( empty( $subscription->price->product ) ) {
			return __( 'No product', 'surecart' );
		}
		return '<a href="' . esc_url( \SureCart::getUrl()->edit( 'product', $subscription->price->product->id ) ) . '">' . $subscription->price->product->name . '</a>';
	}

	/**
	 * Show any integrations.
	 *
	 * @param \SureCart\Models\Subscription $subscription The subscription model.
	 * @return string
	 */
	public function column_integrations( $subscription ) {
		$product = $subscription->purchase->product ?? null;
		$output  = $product ? $this->productIntegrationsList( $product ) : false;
		return $output ? $output : '-';
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
				'query'  => $this->get_search_query(),
			]
		)->with( [ 'customer', 'price', 'price.product', 'current_period', 'purchase' ] )
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
		$status = sanitize_text_field( wp_unslash( $_GET['status'] ?? null ) );
		if ( 'all' === $status ) {
			$status = null;
		}
		return $status ? [ esc_html( $status ) ] : [];
	}

	/**
	 * The remaining payments for the subscription
	 *
	 * @param \SureCart\Models\Subscription $subscription The subscription model.
	 *
	 * @return string
	 */
	public function column_remaining_payments( $subscription ) {
		if ( null === $subscription->remaining_period_count ) {
			if ( 'completed' === $subscription->status ) {
				return '-';
			} else {
				return '&infin;';
			}
		}
		if ( 0 === $subscription->remaining_period_count ) {
			return __( 'None', 'surecart' );
		}

		return (int) $subscription->remaining_period_count;
	}

	/**
	 * The subscription type
	 *
	 * @param \SureCart\Models\Subscription $subscription The subscription model.
	 *
	 * @return string
	 */
	// public function column_type( $subscription ) {
	// 	if ( null === $subscription->remaining_period_count ) {
	// 		return '<sc-tag type="success">' . __( 'Subscription', 'surecart' ) . '</sc-tag>';
	// 	}
	// 	return '<sc-tag type="info">' . __( 'Payment Plan', 'surecart' ) . '</sc-tag>';
	// }

	/**
	 * Handle the total column
	 *
	 * @param \SureCart\Models\Subscription $subscription Checkout Session Model.
	 *
	 * @return string
	 */
	public function column_plan( $subscription ) {
		$amount       = $subscription->price->amount ?? 0;
		$interval     = $subscription->price->recurring_interval ?? '';
		$count        = $subscription->price->recurring_interval_count ?? 1;
		$period_count = $subscription->price->recurring_period_count ?? null;
		ob_start();
		echo '<sc-format-number type="currency" currency="' . esc_html( strtoupper( $subscription->currency ?? 'usd' ) ) . '" value="' . (float) $amount . '"></sc-format-number>';
		echo esc_html( $this->getInterval( $interval, $count ) );
		if ( null !== $period_count ) {
			echo esc_html( $this->getInterval( $interval, $period_count, __( 'for', 'surecart' ) ) );
		}
		return ob_get_clean();
	}

	public function getInterval( $interval, $count, $separator = '/', $show_single = false ) {
		switch ( $interval ) {
			case 'day':
				return " $separator " . sprintf(
					// translators: number of days.
					$show_single ? _n( '%d day', '%d days', $count, 'surecart' ) : _n( 'day', '%d days', $count, 'surecart' ),
					$count
				);
			case 'week':
				return " $separator " . sprintf(
					// translators: number of weeks.
					$show_single ? _n( '%d week', '%d weeks', $count, 'surecart' ) : _n( 'week', '%d weeks', $count, 'surecart' ),
					$count
				);
			case 'month':
				return " $separator " . sprintf(
					// translators: number of months
					$show_single ? _n( '%d month', '%d months', $count, 'surecart' ) : _n( 'month', '%d months', $count, 'surecart' ),
					$count
				);
			case 'year':
				return " $separator " . sprintf(
					// translators: number of yearls
					$show_single ? _n( '%d year', '%d years', $count, 'surecart' ) : _n( 'year', '%d years', $count, 'surecart' ),
					$count
				);
		}
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
		return sprintf( __( 'Valid until %s', 'surecart' ), date_i18n( get_option( 'date_format' ), $timestamp / 1000 ) );
	}

	public function get_price_string( $coupon = '' ) {
		if ( ! $coupon || empty( $coupon->duration ) ) {
			return;
		}
		if ( ! empty( $coupon->percent_off ) ) {
			// translators: Coupon % off.
			return sprintf( esc_html( __( '%1d%% off', 'surecart' ) ), $coupon->percent_off );
		}

		if ( ! empty( $coupon->amount_off ) ) {
			// translators: Coupon amount off.
			return Currency::formatCurrencyNumber( $coupon->amount_off ) . ' <small style="opacity: 0.75;">' . strtoupper( esc_html( $coupon->currency ) ) . '</small>';
		}

		return esc_html__( 'No discount.', 'surecart' );
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
			return __( 'Forever', 'surecart' );
		}
		if ( 'repeating' === $coupon->duration ) {
			// translators: number of months.
			return sprintf( __( 'For %d months', 'surecart' ), $coupon->duration_in_months ?? 1 );
		}

		return __( 'Once', 'surecart' );
	}

	/**
	 * Handle the status
	 *
	 * @param \SureCart\Models\Price $product Product model.
	 *
	 * @return string
	 */
	public function column_status( $subscription ) {
		return wp_kses_post( "<sc-subscription-status-badge status='$subscription->status'></sc-subscription-status-badge>" );
		// switch ( $subscription->status ) {
		// case 'active':
		// $status = '<sc-tag type="success">' . __( 'Active', 'surecart' ) . '</sc-tag>';
		// break;
		// case 'canceled':
		// $status = '<sc-tag type="danger">' . __( 'Canceled', 'surecart' ) . '</sc-tag>';
		// break;
		// case 'trialing':
		// $status = '<sc-tag type="primary">' . __( 'Trialing', 'surecart' ) . '</sc-tag>';
		// break;
		// case 'draft':
		// $status = '<sc-tag>' . __( 'Draft', 'surecart' ) . '</sc-tag>';
		// break;
		// default:
		// $status = '<sc-tag>' . $subscription->status . '</sc-tag>';
		// break;
		// }

		// if ( ! empty( (array) $subscription->pending_update ) ) {
		// $status .= ' <sc-tag type="info">' . __( 'Update Pending', 'surecart' ) . '</sc-tag>';
		// }

		// return $status;
	}

	/**
	 * Name of the coupon
	 *
	 * @param \SureCart\Models\Promotion $promotion Promotion model.
	 *
	 * @return string
	 */
	public function column_customer( $subscription ) {
		ob_start();
		$name = $subscription->customer->name ?? '';
		if ( ! $name ) {
			$name = $subscription->customer->email ?? __( 'No name provided', 'surecart' );
		}
		?>
		<a class="row-title" aria-label="<?php echo esc_attr__( 'Edit Subscription', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->show( 'subscription', $subscription->id ) ); ?>">
			<?php echo esc_html( $name ); ?>
		</a>

		<?php
		echo $this->row_actions(
			[
				'edit' => '<a href="' . esc_url( \SureCart::getUrl()->show( 'subscription', $subscription->id ) ) . '" aria-label="' . esc_attr( 'Edit Subscription', 'surecart' ) . '">' . __( 'Edit', 'surecart' ) . '</a>',
			],
		);
		?>
		<?php
		return ob_get_clean();
	}
}
