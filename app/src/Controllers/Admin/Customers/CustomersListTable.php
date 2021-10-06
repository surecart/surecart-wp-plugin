<?php

namespace CheckoutEngine\Controllers\Admin\Customers;

use CheckoutEngine\Models\Product;
use CheckoutEngine\Models\Customer;
use CheckoutEngine\Support\Currency;
use CheckoutEngine\Support\TimeDate;
use CheckoutEngine\Controllers\Admin\Tables\ListTable;
/**
 * Create a new table class that will extend the WP_List_Table
 */
class CustomersListTable extends ListTable {
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

		$this->_column_headers = array( $columns, $hidden, $sortable );

		$query = $this->table_data();
		if ( is_wp_error( $query ) ) {
			$this->items = [];
			return;
		}

		$this->set_pagination_args(
			[
				'total_items' => $query->pagination->count,
				'per_page'    => $this->get_items_per_page( 'customerss' ),
			]
		);

		$this->items = $query->data;
	}

	public function search() { ?>
	<form class="search-form"
		method="get">
		<?php $this->search_box( __( 'Search Customers' ), 'user' ); ?>
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
			'name'   => __( 'Name', 'checkout_engine' ),
			'email'  => __( 'Email', 'checkout_engine' ),
			'orders' => __( 'Orders', 'checkout_engine' ),
			// 'description' => __( 'Description', 'checkout_engine' ),
			// 'price'       => __( 'Price', 'checkout_engine' ),
			// 'date'        => __( 'Date', 'checkout_engine' ),
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
		return Customer::where(
			[
				'limit' => $this->get_items_per_page( 'customers' ),
				'page'  => $this->get_pagenum(),
			]
		)->paginate();
	}

	/**
	 * Nothing found.
	 *
	 * @return string
	 */
	public function no_items() {
		echo esc_html_e( 'No products found.', 'checkout_engine' );
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
			return '<ce-tag type="warning">' . __( 'No price', 'checkout_engine' ) . '</ce-tag>';
		}

		if ( ! empty( $product->prices[0]->amount ) ) {
			$min_price = min( array_column( $product->prices, 'amount' ) );
			$amount    = Currency::format( $min_price ) . ' <small style="opacity: 0.75;">' . strtoupper( esc_html( $product->prices[0]->currency ) ) . '</small>';
			// translators: Price starting at.
			return count( $product->prices ) > 1 ? sprintf( __( 'Starting at %s', 'checkout_engine' ), $amount ) : $amount;
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
	public function column_date( $product ) {
		$created = sprintf(
			'<time datetime="%1$s" title="%2$s">%3$s</time>',
			esc_attr( $product->created_at ),
			esc_html( TimeDate::formatDateAndTime( $product->created_at ) ),
			esc_html( TimeDate::humanTimeDiff( $product->created_at ) )
		);
		$updated = sprintf(
			'%1$s <time datetime="%2$s" title="%3$s">%4$s</time>',
			__( 'Updated', 'checkout_engine' ),
			esc_attr( $product->updated_at ),
			esc_html( TimeDate::formatDateAndTime( $product->updated_at ) ),
			esc_html( TimeDate::humanTimeDiff( $product->updated_at ) )
		);
		return $created . '<br /><small style="opacity: 0.75">' . $updated . '</small>';
	}

	public function column_email( $customer ) {
		return sanitize_email( $customer->email );
	}

	/**
	 * Name column
	 *
	 * @param \CheckoutEngine\Models\Customer $customer Customer model.
	 *
	 * @return string
	 */
	public function column_name( $customer ) {
		ob_start();
		?>
		<a class="row-title" aria-label="<?php echo esc_attr( 'Edit Customer', 'checkout_engine' ); ?>" href="<?php echo esc_url( \CheckoutEngine::getUrl()->edit( 'customers', $customer->id ) ); ?>">
			<?php echo wp_kses_post( $customer->name ?? $customer->email ); ?>
		</a>

		<?php
		echo $this->row_actions(
			[
				'edit' => '<a href="' . esc_url( \CheckoutEngine::getUrl()->edit( 'customers', $customer->id ) ) . '" aria-label="' . esc_attr( 'Edit Customer', 'checkout_engine' ) . '">' . __( 'Edit', 'checkout_engine' ) . '</a>',
				// 'trash' => $this->action_toggle_archive( $product ),
			],
		);
		?>

		<?php
		return ob_get_clean();
	}

	/**
	 * Toggle archive action link and text.
	 *
	 * @param \CheckoutEngine\Models\Product $product Product model.
	 * @return string
	 */
	public function action_toggle_archive( $product ) {
		$text            = $product->archived ? __( 'Un-Archive', 'checkout_engine' ) : __( 'Archive', 'checkout_engine' );
		$confirm_message = $product->archived ? __( 'Are you sure you want to restore this product? This will be be available to purchase.', 'checkout_engine' ) : __( 'Are you sure you want to archive this product? This will be unavailable for purchase.', 'checkout_engine' );
		$link            = \CheckoutEngine::getUrl()->toggleArchive( 'product', $product->id );

		return sprintf(
			'<a class="submitdelete" onclick="return confirm(\'%1s\')" href="%2s" aria-label="%3s">%4s</a>',
			esc_attr( $confirm_message ),
			esc_url( $link ),
			esc_attr__( 'Toggle Product Archive', 'checkout_engine' ),
			esc_html( $text )
		);
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
				return '<a href="' . \CheckoutEngine::getUrl()->edit( 'product', $product->id ) . '">' . $product->name . '</a>';
			case 'name':
			case 'description':
				return $product->$column_name ?? '';
		}
	}
}
