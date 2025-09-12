<?php

namespace SureCart\Controllers\Admin\Reviews;

use SureCart\Controllers\Admin\Tables\ListTable;
use SureCart\Models\Review;
use WP_Error;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class ReviewsListTable extends ListTable {
	public $checkbox = true;
	public $error    = '';
	public $pages    = array();

	/**
	 * Prepare the items for the table to process
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
		foreach ( $this->getStatuses() as $status => $label ) {
			$link                    = admin_url( 'admin.php?page=sc-reviews' );
			$current_link_attributes = '';

			if ( ! empty( $_GET['status'] ) ) {
				if ( $status === $_GET['status'] ) {
					$current_link_attributes = ' class="current" aria-current="page"';
				}
			} elseif ( 'all' === $status ) {
				$current_link_attributes = ' class="current" aria-current="page"';
			}

			$link = add_query_arg( 'status', $status, $link );

			$link = esc_url( $link );

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
	 * @return array
	 */
	public function get_columns() {
		return array_merge(
			[
				'cb'           => '<input type="checkbox" />',
				'review'       => __( 'Review', 'surecart' ),
				'rating'       => __( 'Rating', 'surecart' ),
				'customer'     => __( 'Customer', 'surecart' ),
				'product'      => __( 'Product', 'surecart' ),
				'status'       => __( 'Status', 'surecart' ),
				'date'         => __( 'Date', 'surecart' ),
			],
			parent::get_columns()
		);
	}

	/**
	 * Define which columns are hidden
	 *
	 * @return array
	 */
	public function get_hidden_columns() {
		return array();
	}

	/**
	 * Get the table data
	 *
	 * @return object|WP_Error
	 */
	private function table_data() {
		$review_query = Review::where(
			array(
				'status[]' => $this->getFilteredStatus(),
				'query'    => $this->get_search_query(),
			)
		)->with( [ 'customer', 'product', 'purchase' ] );

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
	 * Displays the checkbox column.
	 *
	 * @param Review $review The review model.
	 */
	public function column_cb( $review ) {
		?>
		<label class="screen-reader-text" for="cb-select-<?php echo esc_attr( $review['id'] ); ?>"><?php _e( 'Select review', 'surecart' ); ?></label>
		<input id="cb-select-<?php echo esc_attr( $review['id'] ); ?>" type="checkbox" name="bulk_action_review_ids[]" value="<?php echo esc_attr( $review['id'] ); ?>" />
			<?php
	}

	/**
	 * Status column
	 *
	 * @param \SureCart\Models\Review $review Review model.
	 *
	 * @return string
	 */
	public function column_status( $review ) {
		ob_start();
		?>
		<sc-tag type="<?php echo esc_attr( $review->status_type ); ?>">
			<?php echo esc_html( $review->status_display_text ); ?>
		</sc-tag>
		<?php
		return ob_get_clean();
	}

	/**
	 * Rating column
	 *
	 * @param \SureCart\Models\Review $review Review model.
	 *
	 * @return string
	 */
	public function column_rating( $review ) {
		ob_start();
		?>
		<div style="display: flex; align-items: center; gap: 0.25em;">
			<?php for ( $i = 1; $i <= 5; $i++ ) : ?>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="<?php echo $i <= $review->rating ? '#fbbf24' : 'none'; ?>" stroke="<?php echo $i <= $review->rating ? '#fbbf24' : '#e5e7eb'; ?>" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
				</svg>
			<?php endfor; ?>
			<span style="margin-left: 0.5em; color: #6b7280;">(<?php echo esc_html( $review->rating ); ?>)</span>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Customer column
	 *
	 * @param \SureCart\Models\Review $review Review model.
	 *
	 * @return string
	 */
	public function column_customer( $review ) {
		if ( empty( $review->customer ) ) {
			return '-';
		}
		return esc_html( $review->customer->name ?? $review->customer->email ?? '-' );
	}

	/**
	 * Product column
	 *
	 * @param \SureCart\Models\Review $review Review model.
	 *
	 * @return string
	 */
	public function column_product( $review ) {
		if ( empty( $review->product ) ) {
			return '-';
		}
		return '<a href="' . esc_url( \SureCart::getUrl()->edit( 'product', $review->product->id ) ) . '">' . esc_html( $review->product->name ) . '</a>';
	}

	/**
	 * Review column
	 *
	 * @param \SureCart\Models\Review $review Review model.
	 *
	 * @return string
	 */
	public function column_review( $review ) {
		ob_start();
		?>
		<div>
			<strong>
				<a class="row-title" aria-label="<?php esc_attr_e( 'Edit Review', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'review', $review->id ) ); ?>">
					<?php echo esc_html( $review->title ?: __( '(No title)', 'surecart' ) ); ?>
				</a>
			</strong>
			<?php if ( ! empty( $review->comment ) ) : ?>
				<div style="margin-top: 0.25em; color: #6b7280;">
					<?php echo esc_html( wp_trim_words( $review->comment, 20 ) ); ?>
				</div>
			<?php endif; ?>
			<?php echo wp_kses_post( $this->row_actions( $this->getRowActions( $review ) ) ); ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Define what data to show on each column of the table
	 *
	 * @param \SureCart\Models\Review $review Review model.
	 * @param string                  $column_name - Current column name.
	 *
	 * @return mixed
	 */
	public function column_default( $review, $column_name ) {
		// Call the parent method to handle custom columns
		parent::column_default( $review, $column_name );

		if ( 'date' === $column_name ) {
			return $review->created_at_date_time;
		}

		return $review->$column_name ?? '';
	}

	/**
	 * Get row actions.
	 *
	 * @param \SureCart\Models\Review $review Review model.
	 *
	 * @return array
	 */
	protected function getRowActions( $review ) {
		$actions = [
			'edit' => '<a href="' . esc_url( \SureCart::getUrl()->edit( 'review', $review->id ) ) . '" aria-label="' . esc_attr( 'Edit Review', 'surecart' ) . '">' . esc_html__( 'Edit', 'surecart' ) . '</a>',
		];

		if ( 'published' === $review->status ) {
			$actions['unpublish'] = '<a href="' . esc_url( wp_nonce_url( add_query_arg( [ 'action' => 'unpublish', 'id' => $review->id ], admin_url( 'admin.php?page=sc-reviews' ) ), 'unpublish_review' ) ) . '" aria-label="' . esc_attr( 'Unpublish Review', 'surecart' ) . '">' . esc_html__( 'Unpublish', 'surecart' ) . '</a>';
		} elseif ( 'in_review' === $review->status ) {
			$actions['publish'] = '<a href="' . esc_url( wp_nonce_url( add_query_arg( [ 'action' => 'publish', 'id' => $review->id ], admin_url( 'admin.php?page=sc-reviews' ) ), 'publish_review' ) ) . '" aria-label="' . esc_attr( 'Publish Review', 'surecart' ) . '">' . esc_html__( 'Publish', 'surecart' ) . '</a>';
		}

		$actions['delete'] = '<a class="submitdelete" onclick="return confirm(\'' . esc_attr__( 'Are you sure you want to delete this review?', 'surecart' ) . '\')" href="' . esc_url( wp_nonce_url( add_query_arg( [ 'action' => 'delete', 'id' => $review->id ], admin_url( 'admin.php?page=sc-reviews' ) ), 'delete_review' ) ) . '" aria-label="' . esc_attr( 'Delete Review', 'surecart' ) . '">' . esc_html__( 'Delete', 'surecart' ) . '</a>';

		return $actions;
	}

	/**
	 * Displays extra table navigation.
	 *
	 * @param string $which Top or bottom placement.
	 */
	protected function extra_tablenav( $which ) {
		?>
		<input type="hidden" name="page" value="sc-reviews" />

		<?php if ( ! empty( $_GET['status'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<input type="hidden" name="status" value="<?php echo esc_attr( $_GET['status'] ); ?>" />
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
	 * @return array
	 */
	protected function get_bulk_actions() {
		$actions = array();
		$actions['publish'] = __( 'Publish', 'surecart' );
		$actions['unpublish'] = __( 'Unpublish', 'surecart' );
		$actions['delete'] = __( 'Delete permanently', 'surecart' );
		return $actions;
	}

	/**
	 * Get filtered status / default status.
	 *
	 * @return string|null
	 */
	private function getFilteredStatus() {
		return ! empty( $_GET['status'] ) && 'all' !== $_GET['status']
			? sanitize_text_field( wp_unslash( $_GET['status'] ) )
			: null;
	}

	/**
	 * Get all statuses.
	 *
	 * @return array
	 */
	private function getStatuses(): array {
		return array(
			'all'         => __( 'All', 'surecart' ),
			'published'   => __( 'Published', 'surecart' ),
			'in_review'   => __( 'In Review', 'surecart' ),
			'archived'    => __( 'Archived', 'surecart' ),
		);
	}
}