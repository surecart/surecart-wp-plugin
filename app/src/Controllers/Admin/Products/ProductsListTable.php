<?php

namespace CheckoutEngine\Controllers\Admin\Products;

use CheckoutEngine\Models\Product;
use CheckoutEngine\Support\Currency;
use CheckoutEngine\Support\TimeDate;
use CheckoutEngine\Controllers\Admin\Tables\ListTable;
/**
 * Create a new table class that will extend the WP_List_Table
 */
class ProductsListTable extends ListTable {
	public $checkbox = true;
	public $error    = '';

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
			$this->error = $query->get_error_message();
			$this->items = [];
			return;
		}

		$this->set_pagination_args(
			[
				'total_items' => $query->pagination->count,
				'per_page'    => $this->get_items_per_page( 'products' ),
			]
		);

		$this->items = $query->data;
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
			'name'        => __( 'Name', 'checkout_engine' ),
			'description' => __( 'Description', 'checkout_engine' ),
			'price'       => __( 'Price', 'checkout_engine' ),
			'date'        => __( 'Date', 'checkout_engine' ),
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
		return Product::where(
			[
				'archived' => $this->getArchiveStatus(),
				'limit'    => $this->get_items_per_page( 'products' ),
				'page'     => $this->get_pagenum(),
			]
		)->paginate();
	}

	/**
	 * Nothing found.
	 *
	 * @return void
	 */
	public function no_items() {
		if ( $this->error ) {
			echo esc_html( $this->error );
			return;
		}
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
		$currency = $product->metrics->currency ?? 'usd';

		if ( empty( $product->metrics->prices_count ) ) {
			return '<ce-tag type="warning">' . __( 'No price', 'checkout_engine' ) . '</ce-tag>';
		}

		if ( ! empty( $product->metrics->min_price_amount ) ) {
			$amount = '<ce-format-number type="currency" currency="' . $currency . '" value="' . $product->metrics->min_price_amount . '"></ce-format-number>';
			if ( $product->metrics->prices_count > 1 ) {
				// translators: Price starting at.
				$starting_at = sprintf( __( 'Starting at %s', 'checkout_engine' ), $amount );
				// translators: Other prices.
				$others = sprintf( _n( 'and %d other price.', 'and %d other prices.', $product->metrics->prices_count - 1, 'checkout_engine' ), $product->metrics->prices_count - 1 );
				return $starting_at . '<br /><small style="opacity: 0.75">' . $others . '</small>';
			} else {
				return $amount;
			}
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

	/**
	 * Name column
	 *
	 * @param \CheckoutEngine\Models\Product $product Product model.
	 *
	 * @return string
	 */
	public function column_name( $product ) {
		ob_start();
		?>

		<div class="ce-product-name">
		<?php if ( $product->image_url ) { ?>
			<img src="<?php echo esc_url( $product->image_url ); ?>" class="ce-product-image-preview" />
		<?php } else { ?>
		<div class="ce-product-image-preview">
			<svg xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
			  </svg>
		</div>
	  <?php } ?>

	  <div>
		<a class="row-title" aria-label="<?php echo esc_attr( 'Edit Product', 'checkout_engine' ); ?>" href="<?php echo esc_url( \CheckoutEngine::getUrl()->edit( 'product', $product->id ) ); ?>">
			<?php echo esc_html_e( $product->name ); ?>
		</a>

		<?php
		echo $this->row_actions(
			[
				'edit'  => '<a href="' . esc_url( \CheckoutEngine::getUrl()->edit( 'product', $product->id ) ) . '" aria-label="' . esc_attr( 'Edit Product', 'checkout_engine' ) . '">' . __( 'Edit', 'checkout_engine' ) . '</a>',
				'trash' => $this->action_toggle_archive( $product ),
			],
		);
		?>
		</div>

		</div>
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
