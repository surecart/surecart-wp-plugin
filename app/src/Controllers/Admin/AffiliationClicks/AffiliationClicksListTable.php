<?php

namespace SureCart\Controllers\Admin\AffiliationClicks;

use SureCart\Controllers\Admin\Tables\ListTable;
use SureCart\Models\Click;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class AffiliationClicksListTable extends ListTable {

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
				'per_page'    => $this->get_items_per_page( 'affiliate_clicks' ),
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
		$link = admin_url( 'admin.php?page=sc-affiliate-clicks' );

		foreach ( $this->getStatuses() as $status => $label ) {
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
		return apply_filters( 'comment_status_links', $status_links );
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return array
	 */
	public function get_columns() {
		return array(
			'date'          => __( 'Date', 'surecart' ),
			'landing_url'   => __( 'Landing URL', 'surecart' ),
			'referring_url' => __( 'Referring URL', 'surecart' ),
			'affiliate'     => __( 'Affiliate', 'surecart' ),
			'converted'     => __( 'Converted', 'surecart' ),
		);
	}

	/**
	 * Handle the date column.
	 *
	 * @param \SureCart\Models\Click $click The Click model.
	 *
	 * @return string
	 */
	public function column_date( $click ) {
		return date_i18n( get_option( 'date_format' ), $click->created_at );
	}

	/**
	 * Handle the landing_url column.
	 *
	 * @param \SureCart\Models\Click $click The Click model.
	 *
	 * @return string
	 */
	public function column_landing_url( $click ) {
		return esc_html( $click->url );
	}

	/**
	 * Handle the referring_url column.
	 *
	 * @param \SureCart\Models\Click $click The Click model.
	 *
	 * @return string
	 */
	public function column_referring_url( $click ) {
		return esc_html( $click->referrer );
	}

	/**
	 * Handle the affiliate column.
	 *
	 * @param \SureCart\Models\Click $click The Click model.
	 *
	 * @return string
	 */
	public function column_affiliate( $click ) {
		$affiliation = $click->affiliation ?? null;
		if ( empty( $affiliation->id ) ) {
			return '';
		}

		ob_start();
		?>

		<div class="sc-affiliate-name">
			<a href="<?php echo esc_url( \SureCart::getUrl()->edit( 'affiliates', $affiliation->id ) ); ?>">
				<?php echo esc_html( $affiliation->first_name . ' ' . $affiliation->last_name ); ?>
			</a>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Handle the converted column.
	 *
	 * @param \SureCart\Models\Click $click The Click model.
	 *
	 * @return string
	 */
	public function column_converted( $click ) {
		// TODO: How to now if it is converted?
		return __( 'No', 'surecart' );
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
	 * @return array
	 */
	private function table_data() {
		$affiate_request_query = Click::where(
			array(
				'converted' => $this->getFilteredStatus(),
				'query'     => $this->get_search_query(),
				'expand'    => [
					'affiliation',
				],
			)
		);

		return $affiate_request_query->paginate(
			array(
				'per_page' => $this->get_items_per_page( 'affiate_requests' ),
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
		echo esc_html_e( 'No affiliate clicks found.', 'surecart' );
	}


	/**
	 * Displays extra table navigation.
	 *
	 * @param string $which Top or bottom placement.
	 */
	protected function extra_tablenav( $which ) {
		?>
		<input type="hidden" name="page" value="sc-affiliate-requests" />

		<?php if ( ! empty( $_GET['status'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<input type="hidden" name="status" value="<?php echo esc_attr( $_GET['status'] ); ?>" />
		<?php endif; ?>

		<?php
		/**
		 * Fires immediately following the closing "actions" div in the tablenav
		 * for the affiliate_requests list table.
		 *
		 * @param string $which The location of the extra table nav markup: 'top' or 'bottom'.
		 */
		do_action( 'manage_affiliate_requests_extra_tablenav', $which );
	}


	/**
	 * Get filtered status / default status.
	 *
	 * @return string|null
	 */
	private function getFilteredStatus() {
		if ( empty( $_GET['status'] ) || $_GET['status'] === 'all' ) {
			return null;
		}

		if ( $_GET['status'] === 'converted' ) {
			return true;
		}

		return false;
	}

	/**
	 * Get all statuses.
	 *
	 * @return array
	 */
	private function getStatuses(): array {
		return array(
			'all'           => __( 'All', 'surecart' ),
			'converted'     => __( 'Converted', 'surecart' ),
			'not_converted' => __( 'Not Converted', 'surecart' ),
		);
	}
}
