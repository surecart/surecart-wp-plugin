<?php

namespace SureCart\Controllers\Admin\Reviews;

use SureCart\Controllers\Admin\Tables\ListTable;
use SureCart\Models\Review;
use WP_Error;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class ReviewsListTable extends ListTable {
	/**
	 * The checkbox.
	 *
	 * @var bool
	 */
	public $checkbox = false;

	/**
	 * The error message.
	 *
	 * @var string
	 */
	public $error = '';

	/**
	 * The list of pages.
	 *
	 * @var array
	 */
	public $pages = array();

	/**
	 * Prepare the items for the table to process.
	 *
	 * @return void
	 */
	public function prepare_items() {
		$columns  = $this->get_columns();
		$hidden   = $this->get_hidden_columns();
		$sortable = $this->get_sortable_columns();

		$this->_column_headers = array( $columns, $hidden, $sortable );

		$query = $this->table_data();

		if ( is_wp_error( $query ) ) {
			$this->error = $query->get_error_message();
			$this->items = array();
			return;
		}

		$this->set_pagination_args(
			array(
				'total_items' => $query->pagination->count,
				'per_page'    => $this->get_items_per_page( 'reviews' ),
			)
		);

		$this->items = $query->data;
	}

	/**
	 * Get views for the list table status links.
	 *
	 * @global int $post_id
	 * @global string $comment_status
	 * @global string $comment_type
	 */
	protected function get_views() {
		$allowed_statuses = array( 'all', 'published', 'in_review', 'unpublished' );
		$requested_status = ! empty( $_GET['status'] ) && in_array( $_GET['status'], $allowed_statuses, true ) ? sanitize_text_field( wp_unslash( $_GET['status'] ) ) : 'all'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		foreach ( $this->getStatuses() as $status => $label ) {
			$link                    = admin_url( 'admin.php?page=sc-reviews' );
			$current_link_attributes = '';

			if ( ! empty( $requested_status ) ) {
				if ( $status === $requested_status ) {
					$current_link_attributes = ' class="current" aria-current="page"';
				}
			} elseif ( 'all' === $status ) {
				$current_link_attributes = ' class="current" aria-current="page"';
			}

			$link = add_query_arg( 'status', $status, $link );

			$link = esc_url( $link ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

			// translators: %s: The number of reviews for a specific status.
			$status_links[ $status ] = sprintf( '<a href="%s"%s>%s</a>', esc_url( $link ), $current_link_attributes, esc_html( $label ) );
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
	 * Override the parent columns method. Defines the columns to use in your listing table.
	 *
	 * @return array
	 */
	public function get_columns() {
		return array_merge(
			[
				'review'   => __( 'Review', 'surecart' ),
				'stars'    => __( 'Rating', 'surecart' ),
				'customer' => __( 'Customer', 'surecart' ),
				'product'  => __( 'Product', 'surecart' ),
				'status'   => __( 'Status', 'surecart' ),
				'date'     => __( 'Submitted on', 'surecart' ),
			],
			parent::get_columns()
		);
	}

	/**
	 * Define which columns are sortable.
	 *
	 * @return array
	 */
	public function get_sortable_columns() {
		return array(
			'stars' => array( 'stars', false ),
			'date'  => array( 'created_at', false ),
		);
	}

	/**
	 * Define which columns are hidden.
	 *
	 * @return array
	 */
	public function get_hidden_columns() {
		return array();
	}

	/**
	 * Get the table data.
	 *
	 * @return object|WP_Error
	 */
	private function table_data() {
		$args = array(
			'status[]' => $this->getFilteredStatus(),
			'query'    => $this->get_search_query(),
		);

		// Add sorting.
		$orderby = $this->get_orderby();
		$order   = $this->get_order();

		if ( $orderby && in_array( $orderby, [ 'stars', 'created_at', 'updated_at' ], true ) ) {
			$args['sort'] = $orderby . ':' . $order;
		}

		$review_query = Review::where( $args )->with( [ 'customer', 'product' ] );

		// Check if there is any sc_product.
		if ( ! empty( $_GET['sc_product'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$review_query->where(
				array(
					'product_ids' => array( sanitize_text_field( wp_unslash( $_GET['sc_product'] ) ) ),  // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				)
			);
		}

		return $review_query->paginate(
			array(
				'per_page' => $this->get_items_per_page( 'reviews' ),
				'page'     => $this->get_pagenum(),
			)
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
		echo esc_html_e( 'No reviews found.', 'surecart' );
	}

	/**
	 * Status column.
	 *
	 * @param Review $review Review model.
	 *
	 * @return string
	 */
	public function column_status( $review ) {
		ob_start();
		?>
		<sc-tag type="<?php echo esc_attr( $review->status_type ); ?>">
			<?php echo esc_html( $review->status_display ); ?>
		</sc-tag>
		<?php
		return ob_get_clean();
	}

	/**
	 * Stars column.
	 *
	 * @param Review $review Review model.
	 *
	 * @return string
	 */
	public function column_stars( $review ) {
		ob_start();
		?>
		<div style="display: flex; gap: 0.25em;">
			<sc-review-stars rating="<?php echo esc_attr( $review->stars ); ?>" color="#fbbf24"></sc-review-stars>
			<span style="color: var(--sc-color-gray-500);">(<?php echo esc_html( $review->stars ); ?>)</span>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Customer column.
	 *
	 * @param Review $review Review model.
	 *
	 * @return string
	 */
	public function column_customer( $review ) {
		if ( empty( $review->customer ) ) {
			return '-';
		}
		$customer_name = $review->customer->name ?? $review->customer->email ?? '-';
		return '<a href="' . esc_url( \SureCart::getUrl()->edit( 'customer', $review->customer->id ?? '' ) ) . '">' . esc_html( $customer_name ) . '</a>';
	}

	/**
	 * Product column.
	 *
	 * @param Review $review Review model.
	 *
	 * @return string
	 */
	public function column_product( $review ) {
		if ( empty( $review->product ) ) {
			return '-';
		}
		return '<a href="' . esc_url( admin_url( '/admin.php?page=sc-reviews&sc_product=' . $review->product->id ) ) . '">' . esc_html( $review->product->name ) . '</a>';
	}

	/**
	 * Review column.
	 *
	 * @param Review $review Review model.
	 *
	 * @return string
	 */
	public function column_review( $review ) {
		ob_start();
		?>
		<div>
			<strong>
				<a class="row-title" aria-label="<?php esc_attr_e( 'Edit Review', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'review', $review->id ) ); ?>">
					<?php echo esc_html( $review->title ); ?>
				</a>
				<?php if ( ! empty( $review->verified ) ) : ?>
					<sc-tooltip text="<?php esc_attr_e( 'Verified Buyer', 'surecart' ); ?>" type="text" style="display: inline-flex; align-items: center; margin-left: 4px;">
						<sc-icon name="verified" style="font-size: 18px; color: var(--sc-color-success-500); vertical-align: middle;"></sc-icon>
					</sc-tooltip>
				<?php endif; ?>
			</strong>
			<?php if ( ! empty( $review->body ) ) : ?>
				<div style="margin-top: 0.25em; color: #6b7280; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">
					<?php echo esc_html( $review->body ); ?>
				</div>
			<?php endif; ?>
			<?php echo $this->row_actions( $this->getRowActions( $review ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Define what data to show on each column of the table.
	 *
	 * @param Review $review      Review model.
	 * @param string $column_name Current column name.
	 *
	 * @return mixed
	 */
	public function column_default( $review, $column_name ) {
		// Call the parent method to handle custom columns.
		parent::column_default( $review, $column_name );

		return $review->$column_name ?? '';
	}

	/**
	 * Get row actions.
	 *
	 * @param Review $review Review model.
	 *
	 * @return array
	 */
	protected function getRowActions( $review ) {
		$actions = [
			'edit' => '<a href="' . esc_url( \SureCart::getUrl()->edit( 'review', $review->id ) ) . '" aria-label="' . esc_attr__( 'Edit Review', 'surecart' ) . '">' . esc_html__( 'Edit', 'surecart' ) . '</a>',
		];

		if ( in_array( $review->status, [ 'in_review', 'unpublished' ], true ) ) {
			$actions['publish'] = '<a href="' . esc_url(
				add_query_arg(
					[
						'action' => 'publish',
						'nonce'  => wp_create_nonce( 'publish_review' ),
						'id'     => $review->id,
					],
					admin_url( 'admin.php?page=sc-reviews' )
				)
			) . '" aria-label="' . esc_attr__( 'Approve Review', 'surecart' ) . '">' . esc_html__( 'Approve', 'surecart' ) . '</a>';
		}

		if ( in_array( $review->status, [ 'in_review', 'published' ], true ) ) {
			$actions['unpublish'] = '<a href="' . esc_url(
				add_query_arg(
					[
						'action' => 'unpublish',
						'nonce'  => wp_create_nonce( 'unpublish_review' ),
						'id'     => $review->id,
					],
					admin_url( 'admin.php?page=sc-reviews' )
				)
			) . '" aria-label="' . esc_attr__( 'Reject Review', 'surecart' ) . '">' . esc_html__( 'Reject', 'surecart' ) . '</a>';
		}

		$actions['delete'] = sprintf(
			/* translators: 1: Confirmation message, 2: URL, 3: aria-label, 4: link text. */
			'<a class="submitdelete" onclick="return confirm(\'%1$s\')" href="%2$s" aria-label="%3$s">%4$s</a>',
			esc_attr__( 'Are you sure? This cannot be undone.', 'surecart' ),
			esc_url(
				add_query_arg(
					[
						'action' => 'delete',
						'nonce'  => wp_create_nonce( 'delete_review' ),
						'id'     => $review->id,
					],
					admin_url( 'admin.php?page=sc-reviews' )
				)
			),
			esc_attr__( 'Delete Review', 'surecart' ),
			esc_html__( 'Delete', 'surecart' )
		);

		return $actions;
	}

	/**
	 * Displays extra table navigation.
	 *
	 * @param string $which Top or bottom placement.
	 */
	protected function extra_tablenav( $which ) {
		$status   = ! empty( $_GET['status'] ) ? sanitize_text_field( wp_unslash( $_GET['status'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$order_by = ! empty( $_GET['orderby'] ) ? sanitize_text_field( wp_unslash( $_GET['orderby'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$order    = ! empty( $_GET['order'] ) ? sanitize_text_field( wp_unslash( $_GET['order'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		?>
		<input type="hidden" name="page" value="sc-reviews" />

		<?php if ( ! empty( $status ) ) : ?>
			<input type="hidden" name="status" value="<?php echo esc_attr( $status ); ?>" />
		<?php endif; ?>

		<?php if ( ! empty( $order_by ) ) : ?>
			<input type="hidden" name="orderby" value="<?php echo esc_attr( $order_by ); ?>" />
		<?php endif; ?>

		<?php if ( ! empty( $order ) ) : ?>
			<input type="hidden" name="order" value="<?php echo esc_attr( $order ); ?>" />
		<?php endif; ?>

		<?php
		/**
		 * Fires immediately following the closing "actions" div in the tablenav
		 * for the reviews list table.
		 *
		 * @param string $which The location of the extra table nav markup: 'top' or 'bottom'.
		 */
		do_action( 'manage_reviews_extra_tablenav', $which );
	}

	/**
	 * Get filtered status / default status.
	 *
	 * @return string|null
	 */
	private function getFilteredStatus() {
		return ! empty( $_GET['status'] ) && 'all' !== $_GET['status'] ? sanitize_text_field( wp_unslash( $_GET['status'] ) ) : null; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	}

	/**
	 * Get all review statuses.
	 *
	 * @return array
	 */
	public function getStatuses(): array {
		return array_merge(
			[ 'all' => __( 'All', 'surecart' ) ],
			( new Review() )->getStatuses()
		);
	}
}
