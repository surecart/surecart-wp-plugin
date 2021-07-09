<?php

namespace CheckoutEngine\Controllers\Admin\Tables;

use NumberFormatter;
use CheckoutEngine\Models\Product;
use CheckoutEngine\Support\Currency;

// WP_List_Table is not loaded automatically so we need to load it in our application.
if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

/**
 * Create a new table class that will extend the WP_List_Table
 */
class ProductsListTable extends \WP_List_Table {
	public $checkbox = true;

	/**
	 * Prepare the items for the table to process
	 *
	 * @return Void
	 */
	public function prepare_items() {
		$columns  = $this->get_columns();
		$hidden   = $this->get_hidden_columns();
		$sortable = $this->get_sortable_columns();

		$data = $this->table_data();
		usort( $data, array( &$this, 'sort_data' ) );

		$perPage     = 2;
		$currentPage = $this->get_pagenum();
		$totalItems  = count( $data );

		$this->set_pagination_args(
			array(
				'total_items' => $totalItems,
				'per_page'    => $perPage,
			)
		);

		// $data = array_slice( $data, ( ( $currentPage - 1 ) * $perPage ), $perPage );

		$this->_column_headers = array( $columns, $hidden, $sortable );
		$this->items           = $data;
	}

	public function search() { ?>
	<form class="search-form"
		method="get">
		<?php $this->search_box( __( 'Search Products' ), 'user' ); ?>
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
			'archived' => __( 'Archived', 'checkout_engine' ),
			'all'      => __( 'All', 'checkout_engine' ),
		];

		$link = admin_url( 'admin.php?page=ce-products' );

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
			'name'        => __( 'Name', 'checkout_engine' ),
			'description' => __( 'Description', 'checkout_engine' ),
			'price'       => __( 'Price', 'checkout_engine' ),
			// 'status'      => __( 'Status', 'checkout_engine' ),
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
	private function table_data() {
		$where = [];
		// if ( ! empty( $_GET['product_status'] ) ) {
		// switch ( $_GET['product_status'] ) {
		// case 'active':
		// $where = [ 'active' => true ];
		// break;
		// case 'archived':
		// $where = [ 'active' => false ];
		// break;
		// }
		// } else {
		// $where = [ 'active' => true ];
		// }

		return Product::where( $where )->get();
	}

	/**
	 * Handle the price column.
	 *
	 * @param \CheckoutEngine\Models\Price $product Product model.
	 *
	 * @return string
	 */
	public function column_price( $product ) {
		if ( empty( $product->prices ) ) {
			return __( 'No price', 'checkout_engine' );
		}

		if ( count( $product->prices ) > 1 ) {
			// translators: Number of prices.
			return sprintf( __( '%1d Prices', 'checkout_engine' ), count( $product->prices ) );
		}

		if ( ! empty( $product->prices[0]->amount ) ) {
			return Currency::format( $product->prices[0]->amount, $product->prices[0]->currency );
		}

		return __( 'No price', 'checkout_engine' );
	}

	/**
	 * Handle the status
	 *
	 * @param \CheckoutEngine\Models\Price $product Product model.
	 *
	 * @return string
	 */
	public function column_status( $product ) {
		// TODO: Add Badge.
		return $product->active ? __( 'Active', 'checkout_engine' ) : __( 'Archived', 'checkout_engine' );
	}

	/**
	 * Define what data to show on each column of the table
	 *
	 * @param \CheckoutEngine\Models\Product $product Product model.
	 * @param String                         $column_name - Current column name.
	 *
	 * @return Mixed
	 */
	public function column_default( $product, $column_name ) {
		switch ( $column_name ) {
			case 'name':
				return '<a href="' . add_query_arg( 'product', $product->id ) . '">' . $product->name . '</a>';
			case 'name':
			case 'description':
				return $product->$column_name ?? '';
		}
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
