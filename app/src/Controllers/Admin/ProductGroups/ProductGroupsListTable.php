<?php

namespace CheckoutEngine\Controllers\Admin\ProductGroups;

use CheckoutEngine\Controllers\Admin\Tables\ListTable;
use CheckoutEngine\Models\ProductGroup;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class ProductGroupsListTable extends ListTable {
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
				'per_page'    => $this->get_items_per_page( 'orders' ),
			]
		);

		$this->items = $query->data;
	}

	public function search() {
		?>
	<form class="search-form"
		method="get">
		<?php $this->search_box( __( 'Search Orders', 'checkout_engine' ), 'order' ); ?>
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

		$link = \CheckoutEngine::getUrl()->index( 'product_groups' );

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
			'name'    => __( 'Name', 'checkout_engine' ),
			'status'  => __( 'Status', 'checkout_engine' ),
			'created' => __( 'Created', 'checkout_engine' ),
		];
	}

	/**
	 * Define which columns are hidden
	 *
	 * @return Array
	 */
	public function get_hidden_columns() {
		return [];
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
	 * Get the archive query status.
	 *
	 * @return boolean|null
	 */
	public function getStatus() {
		$status = $_GET['status'] ?? 'active';
		if ( 'active' === $status ) {
			return [ 'archived' => false ];
		}
		if ( 'archived' === $status ) {
			return [ 'archived' => true ];
		}
		if ( 'all' === $status ) {
			return [];
		}
		return $status;
	}

	/**
	 * Get the table data
	 *
	 * @return Object
	 */
	protected function table_data() {
		return ProductGroup::where(
			[
				$this->getStatus(),
			]
		)->paginate(
			[
				'per_page' => $this->get_items_per_page( 'product_group' ),
				'page'     => $this->get_pagenum(),
			]
		);
	}

	/**
	 * Handle the total column
	 *
	 * @param \CheckoutEngine\Models\Order $order Checkout Session Model.
	 *
	 * @return string
	 */
	public function column_date( $order ) {
		return "<ce-format-date date='$order->created' type='timestamp'></ce-format-date>";
	}

	/**
	 * Handle the status
	 *
	 * @param \CheckoutEngine\Models\Order $order Order Model.
	 *
	 * @return string
	 */
	public function column_status( $group ) {
		return $group->archived ? '<ce-tag type="warning">' . __( 'Archived', 'checkout_engine' ) . '</ce-tag>' : '<ce-tag type="success">' . __( 'Live', 'checkout_engine' ) . '</ce-tag>';
	}

	public function column_name( $group ) {
		ob_start();
		?>
		<a class="row-title" aria-label="<?php echo esc_attr__( 'Edit Order', 'checkout_engine' ); ?>" href="<?php echo esc_url( \CheckoutEngine::getUrl()->edit( 'product_group', $group->id ) ); ?>">
			<?php echo \sanitize_text_field( $group->name ); ?>
		</a>
		<?php
		echo $this->row_actions(
			[
				'view' => '<a href="' . esc_url( \CheckoutEngine::getUrl()->show( 'product_group', $group->id ) ) . '" aria-label="' . esc_attr( 'View Product Group', 'checkout_engine' ) . '">' . __( 'View', 'checkout_engine' ) . '</a>',
			],
		);
		return ob_get_clean();
	}
}
