<?php

namespace CheckoutEngine\Controllers\Admin\Coupons;

use NumberFormatter;
use CheckoutEngine\Models\Coupon;
use CheckoutEngine\Models\Product;
use CheckoutEngine\Models\Promotion;
use CheckoutEngine\Support\Currency;
use CheckoutEngine\Controllers\Admin\Tables\ListTable;

// WP_List_Table is not loaded automatically so we need to load it in our application.
if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

/**
 * Create a new table class that will extend the WP_List_Table
 */
class CouponsListTable extends ListTable {

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
				'per_page'    => $this->get_items_per_page( 'coupons' ),
			]
		);

		$this->items = $query->data;
	}

	/**
	 * Search form.
	 *
	 * @return void
	 */
	public function search() {
		?>
	<form class="search-form"
		method="get">
		<?php $this->search_box( __( 'Search Coupons', 'checkout_engine' ), 'coupon' ); ?>
		<input type="hidden"
			name="id"
			value="1" />
	</form>
		<?php
	}

	/**
	 * Get the table views.
	 *
	 * @global int $post_id
	 * @global string $comment_status
	 * @global string $comment_type
	 */
	protected function get_views() {
		$stati = [
			'active'   => __( 'Active', 'checkout_engine' ),
			'archived' => __( 'Archived', 'checkout_engine' ),
			'all'      => __( 'All', 'checkout_engine' ),
		];

		$link = \CheckoutEngine::getUrl()->index( 'coupon' );

		foreach ( $stati as $status => $label ) {
			$current_link_attributes = '';

			if ( ! empty( $_GET['product_status'] ) ) {
				if ( $status === $_GET['product_status'] ) {
					$current_link_attributes = ' class="current" aria-current="page"';
				}
			} elseif ( 'active' === $status ) {
				$current_link_attributes = ' class="current" aria-current="page"';
			}

			$link = add_query_arg( 'product_status', $status, $link );

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
		return apply_filters( 'comment_status_links', $status_links );
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return Array
	 */
	public function get_columns() {
		return [
			// 'cb'          => '<input type="checkbox" />',
			'name'  => __( 'Name', 'checkout_engine' ),
			'code'  => __( 'Code', 'checkout_engine' ),
			'price' => __( 'Price', 'checkout_engine' ),
			'usage' => __( 'Usage', 'checkout_engine' ),
			'date'  => __( 'Date', 'checkout_engine' ),
		];
	}

	/**
	 * Displays the checkbox column.
	 *
	 * @param Product $product The product model.
	 */
	public function column_cb( $product ) {
		?>
		<label class="screen-reader-text" for="cb-select-<?php echo esc_attr( $product['id'] ); ?>"><?php esc_html_e( 'Select comment' ); ?></label>
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
	 * @return Object
	 */
	private function table_data() {
		return Coupon::where(
			[
				'archived' => $this->getArchiveStatus(),
				'limit'    => $this->get_items_per_page( 'coupons' ),
				'page'     => $this->get_pagenum(),
			]
		)->paginate();
	}

	/**
	 * Handle the price column.
	 *
	 * @param \CheckoutEngine\Models\Coupon $coupon Coupon model.
	 *
	 * @return string
	 */
	public function column_price( $coupon ) {
		ob_start();
		// phpcs:ignore
		echo $this->get_price_string( $coupon ?? false ); // this is already escaped. ?>
		<br />
		<div style="opacity: 0.75"><?php echo esc_html( $this->get_duration_string( $coupon ?? false ) ); ?></div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Output the Promo Code
	 *
	 * @param Promotion $promotion Promotion model.
	 *
	 * @return string
	 */
	public function column_usage( $coupon ) {
		$max = $coupon->max_redemptions ?? '&infin;';
		ob_start();
		echo \esc_html( "$coupon->times_redeemed / $max" );
		?>
		<br />
		<div style="opacity: 0.75"><?php echo \esc_html( $this->get_expiration_string( $coupon->redeem_by ) ); ?></div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render the "Redeem By"
	 *
	 * @param string $timestamp Redeem timestamp
	 * @return void
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
			return '<ce-format-number type="currency" currency="' . $coupon->currency . '" value="' . $coupon->amount_off . '"></ce-format-number>';
		}

		return esc_html_( 'No discount.', 'checkout_engine' );
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
	public function column_status( $coupon ) {
		// TODO: Add Badge.
		return $coupon->expired ? __( 'Expired', 'checkout_engine' ) : __( 'Active', 'checkout_engine' );
	}

	protected function extra_tablenav( $which ) {
		if ( 'top' === $which ) {
			return $this->views();
		}
	}

	/**
	 * Name of the coupon
	 *
	 * @param \CheckoutEngine\Models\Promotion $promotion Promotion model.
	 *
	 * @return string
	 */
	public function column_name( $coupon ) {
		ob_start();
		?>
		<a class="row-title" aria-label="Edit Coupon" href="<?php echo esc_url( \CheckoutEngine::getUrl()->edit( 'coupon', $coupon->id ) ); ?>">
			<?php echo esc_html_e( $coupon->name ); ?>
		</a>
				<?php
				return ob_get_clean();
	}

	/**
	 * Name of the coupon
	 *
	 * @param \CheckoutEngine\Models\Promotion $promotion Promotion model.
	 *
	 * @return string
	 */
	public function column_code( $coupon ) {
		$code = $coupon->code ?? __( 'No code specified', 'checkout_engine' );
		return '<code>' . sanitize_text_field( $code ) . '</code>';
	}

	/**
	 * Allows you to sort the data by the variables set in the $_GET.
	 *
	 * @return Mixed
	 */
	private function sort_data( $a, $b ) {
		// Set defaults
		$orderby = 'title';
		$order   = 'asc';

		// If orderby is set, use this as the sort column
		if ( ! empty( $_GET['orderby'] ) ) {
			$orderby = $_GET['orderby'];
		}

		// If order is set use this as the order
		if ( ! empty( $_GET['order'] ) ) {
			$order = $_GET['order'];
		}

		$result = strcmp( $a[ $orderby ], $b[ $orderby ] );

		if ( $order === 'asc' ) {
			return $result;
		}

		return -$result;
	}

	/**
	 * @global string $comment_status
	 *
	 * @return array
	 */
	protected function get_bulk_actions() {
		return false;
		global $comment_status;

		$actions = array();
		if ( in_array( $comment_status, array( 'all', 'approved' ), true ) ) {
			$actions['unapprove'] = __( 'Unapprove' );
		}
		if ( in_array( $comment_status, array( 'all', 'moderated' ), true ) ) {
			$actions['approve'] = __( 'Approve' );
		}
		if ( in_array( $comment_status, array( 'all', 'moderated', 'approved', 'trash' ), true ) ) {
			$actions['spam'] = _x( 'Mark as spam', 'comment' );
		}

		if ( 'trash' === $comment_status ) {
			$actions['untrash'] = __( 'Restore' );
		} elseif ( 'spam' === $comment_status ) {
			$actions['unspam'] = _x( 'Not spam', 'comment' );
		}

		if ( in_array( $comment_status, array( 'trash', 'spam' ), true ) || ! EMPTY_TRASH_DAYS ) {
			$actions['delete'] = __( 'Delete permanently' );
		} else {
			$actions['trash'] = __( 'Move to Trash' );
		}

		return $actions;
	}
}
