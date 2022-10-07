<?php

namespace SureCart\Controllers\Admin\Products;

use SureCart\Models\Product;
use SureCart\Support\Currency;
use SureCart\Support\TimeDate;
use SureCart\Controllers\Admin\Tables\ListTable;
use SureCart\Models\Integration;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class ProductsListTable extends ListTable {
	public $checkbox = true;
	public $error    = '';
	public $pages    = [];

	/**
	 * Prepare the items for the table to process
	 *
	 * @return Void
	 */
	public function prepare_items() {
		$this->pages = \SureCart::productPage()->get();
		$columns     = $this->get_columns();
		$hidden      = $this->get_hidden_columns();
		$sortable    = $this->get_sortable_columns();

		// don't show the product page if there is no pages created.
		if ( empty( $this->pages ) ) {
			unset( $columns['product_page'] );
		}

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

	/**
	 * @global int $post_id
	 * @global string $comment_status
	 * @global string $comment_type
	 */
	protected function get_views() {
		$stati = [
			'active'   => __( 'Active', 'surecart' ),
			'archived' => __( 'Archived', 'surecart' ),
			'all'      => __( 'All', 'surecart' ),
		];

		$link = admin_url( 'admin.php?page=sc-products' );

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
			'name'         => __( 'Name', 'surecart' ),
			// 'description' => __( 'Description', 'surecart' ),
			'price'        => __( 'Price', 'surecart' ),
			// 'type'         => __( 'Type', 'surecart' ),
			'integrations' => __( 'Integrations', 'surecart' ),
			'product_page' => __( 'Product Page' ),
			'date'         => __( 'Date', 'surecart' ),
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
	 * Show any integrations.
	 */
	public function column_integrations( $product ) {
		$list = $this->productIntegrationsList( $product->id );
		return $list ? $list : '-';
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
				'query'    => $this->get_search_query(),
			]
		)->paginate(
			[
				'per_page' => $this->get_items_per_page( 'products' ),
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
		if ( $this->error ) {
			echo esc_html( $this->error );
			return;
		}
		echo esc_html_e( 'No products found.', 'surecart' );
	}

	/**
	 * Handle the type column output.
	 *
	 * @param \SureCart\Models\Price $product Product model.
	 *
	 * @return string
	 */
	public function column_type( $product ) {
		if ( $product->recurring ) {
			return '<sc-tag type="success">
			<div
				style="
					display: flex;
					align-items: center;
					gap: 0.5em;"
			>
				<sc-icon name="repeat"></sc-icon>
				' . esc_html__( 'Subscription', 'surecart' ) . '
			</div>
		</sc-tag>';
		}

		return '<sc-tag type="info">
		<div
			style="
				display: flex;
				align-items: center;
				gap: 0.5em;"
		>
			<sc-icon name="bookmark"></sc-icon>
			' . esc_html__( 'One-Time', 'surecart' ) . '
		</div>
	</sc-tag>';
	}

	/**
	 * Handle the price column.
	 *
	 * @param \SureCart\Models\Product $product Product model.
	 *
	 * @return string
	 */
	public function column_price( $product ) {
		$currency = $product->metrics->currency ?? 'usd';

		if ( empty( $product->metrics->prices_count ) ) {
			return '<sc-tag type="warning">' . esc_html__( 'No price', 'surecart' ) . '</sc-tag>';
		}

		if ( ! empty( $product->metrics->min_price_amount ) ) {
			$amount = '<sc-format-number type="currency" currency="' . $currency . '" value="' . $product->metrics->min_price_amount . '"></sc-format-number>';
			if ( $product->metrics->prices_count > 1 ) {
				// translators: Price starting at.
				$starting_at = sprintf( esc_html__( 'Starting at %s', 'surecart' ), $amount );
				// translators: Other prices.
				$others = sprintf( _n( 'and %d other price.', 'and %d other prices.', $product->metrics->prices_count - 1, 'surecart' ), $product->metrics->prices_count - 1 );
				return $starting_at . '<br /><small style="opacity: 0.75">' . $others . '</small>';
			} else {
				return $amount;
			}
		}

		if ( 1 === $product->metrics->prices_count ) {
			return esc_html__( 'Name your own price', 'surecart' );
		}

		return esc_html__( 'No price', 'surecart' );
	}

	/**
	 * Handle the status
	 *
	 * @param \SureCart\Models\Price $product Product model.
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
			__( 'Updated', 'surecart' ),
			esc_attr( $product->updated_at ),
			esc_html( TimeDate::formatDateAndTime( $product->updated_at ) ),
			esc_html( TimeDate::humanTimeDiff( $product->updated_at ) )
		);
		return $created . '<br /><small style="opacity: 0.75">' . $updated . '</small>';
	}


	/**
	 * Published column
	 *
	 * @param \SureCart\Models\Product $product Product model.
	 *
	 * @return string
	 */
	public function column_product_page( $product ) {
		ob_start();
		$edit_page = $this->get_page( $product );
		?>

			<?php
			$status       = get_post_status( $edit_page );
			$status_label = $status ? get_post_status_object( $status )->label : false;
			switch ( $status ) {
				case 'trash':
					$type = 'danger';
					break;
				case 'draft':
					$type = 'info';
					break;
				case 'publish':
					$type = 'success';
					break;
				default:
					$type = 'default';
					break;
			}
			?>

			<?php if ( $status_label ) { ?>
				<sc-tag type="<?php echo esc_attr( $type ); ?>"><?php echo esc_html( $status_label ); ?></sc-tag>
			<?php } else { ?>
				-
			<?php } ?>

		<?php
		return ob_get_clean();
	}

	/**
	 * Name column
	 *
	 * @param \SureCart\Models\Product $product Product model.
	 *
	 * @return string
	 */
	public function column_name( $product ) {
		$edit_page = $this->get_page( $product );

		ob_start();
		?>

		<div class="sc-product-name">
		<?php if ( $product->image_url ) { ?>
			<img src="<?php echo esc_url( $product->image_url ); ?>" class="sc-product-image-preview" />
		<?php } else { ?>
			<div class="sc-product-image-preview">
				<svg xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			</div>
		<?php } ?>

	  <div>
		<a class="row-title" aria-label="<?php echo esc_attr( 'Edit Product', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'product', $product->id ) ); ?>">
			<?php echo esc_html_e( $product->name, 'surecart' ); ?>
		</a>

		<script> function copyClick(e, content){
			navigator.clipboard.writeText(content).then(() =>{
				const oldText = e.target.innerText;
				e.target.innerText = '<?php echo esc_html_e( 'Copied!', 'surecart' ); ?>';
				setTimeout(() =>{
					e.target.innerText = oldText;
				}, 2000);
			}).catch(err => {

			});
		} </script>


		<?php
		echo $this->row_actions(
			array_filter(
				[
					'edit'         => '<a href="' . esc_url( \SureCart::getUrl()->edit( 'product', $product->id ) ) . '" aria-label="' . esc_attr( 'Edit Product', 'surecart' ) . '">' . esc_html__( 'Edit', 'surecart' ) . '</a>',
					'edit_product' => $edit_page ? '<a href="' . esc_url( get_edit_post_link( $edit_page->ID ) ) . '" aria-label="' . esc_attr( 'Edit Product Page', 'surecart' ) . '">' . esc_html__( 'Edit Page', 'surecart' ) . '</a>' : null,
					'trash'        => $this->action_toggle_archive( $product ),
				]
			),
		);
		?>
		</div>

		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the page for the product.
	 *
	 * @param \SureCart\Models\Product $product
	 *
	 * @return void
	 */
	public function get_page( $product ) {
		$edit_page = null;
		foreach ( $this->pages as $page ) {
			if ( $product->id === $page->sc_product_id ) {
				$edit_page = $page;
			}
		}
		return $edit_page;
	}

	/**
	 * Toggle archive action link and text.
	 *
	 * @param \SureCart\Models\Product $product Product model.
	 * @return string
	 */
	public function action_toggle_archive( $product ) {
		$text            = $product->archived ? __( 'Un-Archive', 'surecart' ) : __( 'Archive', 'surecart' );
		$confirm_message = $product->archived ? __( 'Are you sure you want to restore this product? This will be be available to purchase.', 'surecart' ) : __( 'Are you sure you want to archive this product? This will be unavailable for purchase.', 'surecart' );
		$link            = \SureCart::getUrl()->toggleArchive( 'product', $product->id );

		return sprintf(
			'<a class="submitdelete" onclick="return confirm(\'%1s\')" href="%2s" aria-label="%3s">%4s</a>',
			esc_attr( $confirm_message ),
			esc_url( $link ),
			esc_attr__( 'Toggle Product Archive', 'surecart' ),
			esc_html( $text )
		);
	}

	/**
	 * Define what data to show on each column of the table
	 *
	 * @param \SureCart\Models\Product $product Product model.
	 * @param String                   $column_name - Current column name.
	 *
	 * @return Mixed
	 */
	public function column_default( $product, $column_name ) {
		switch ( $column_name ) {
			case 'name':
				return '<a href="' . \SureCart::getUrl()->edit( 'product', $product->id ) . '">' . $product->name . '</a>';
			case 'name':
			case 'description':
				return $product->$column_name ?? '';
		}
	}
}
