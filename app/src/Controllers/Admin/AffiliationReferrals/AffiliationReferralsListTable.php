<?php

namespace SureCart\Controllers\Admin\AffiliationReferrals;

use SureCart\Controllers\Admin\Tables\ListTable;
use SureCart\Models\Referral;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class AffiliationReferralsListTable extends ListTable {

	/**
	 * Checkbox
	 *
	 * @var boolean
	 */
	public $checkbox = true;

	/**
	 * Error
	 *
	 * @var string
	 */
	public $error = '';

	/**
	 * Pages
	 *
	 * @var array
	 */
	public $pages = array();

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
				'per_page'    => $this->get_items_per_page( 'affiliate_referrals' ),
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
		$link = admin_url( 'admin.php?page=sc-affiliate-referrals' );

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
		 * Filters the sc_affiliation_referrals status links.
		 *
		* @since 2.5.0
		* @since 5.1.0 The 'Mine' link was added.
		*
		*  @param string[] $status_links An associative array of fully-formed sc_affiliation_referrals status links. Includes 'All', 'Mine','Pending', 'Approved', 'Spam', and 'Trash'.
		* */
		return apply_filters( 'sc_affiliation_referrals_status_links', $status_links );
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return array
	 */
	public function get_columns() {
		return array(
			'date'        => esc_html__( 'Date', 'surecart' ),
			'status'      => esc_html__( 'Status', 'surecart' ),
			'affiliate'   => esc_html__( 'Affiliate', 'surecart' ),
			'description' => esc_html__( 'Description', 'surecart' ),
			'order'       => esc_html__( 'Order', 'surecart' ),
			'commission'  => esc_html__( 'Commission', 'surecart' ),
		);
	}

	/**
	 * Handle the date column.
	 *
	 * @param \SureCart\Models\Referral $referral The Referral model.
	 *
	 * @return string
	 */
	public function column_date( $referral ) {
		ob_start();
		echo wp_kses_post( date_i18n( get_option( 'date_format' ), $referral->created_at ) );
		?>
		<?php
			echo wp_kses_post(
				$this->row_actions(
					array_filter(
						array(
							'edit'           => '<a href="' . esc_url( \SureCart::getUrl()->edit( 'affiliate-referrals', $referral->id ) ) . '" aria-label="' . esc_attr__( 'Edit', 'surecart' ) . '">' . esc_html__( 'Edit', 'surecart' ) . '</a>',
							'approve'        => '<a href="' . esc_url( $this->get_action_url( $referral->id, 'approve' ) ) . '" aria-label="' . esc_attr__( 'Approve', 'surecart' ) . '">' . esc_html__( 'Approve', 'surecart' ) . '</a>',
							'deny'           => '<a href="' . esc_url( $this->get_action_url( $referral->id, 'deny' ) ) . '" aria-label="' . esc_attr__( 'Deny', 'surecart' ) . '">' . esc_html__( 'Deny', 'surecart' ) . '</a>',
							'make_reviewing' => '<a href="' . esc_url( $this->get_action_url( $referral->id, 'make_reviewing' ) ) . '" aria-label="' . esc_attr__( 'Make Reviewing', 'surecart' ) . '">' . esc_html__( 'Make Reviewing', 'surecart' ) . '</a>',
							'delete'         => '<a href="' . esc_url( $this->get_action_url( $referral->id, 'delete' ) ) . '" aria-label="' . esc_attr__( 'Delete', 'surecart' ) . '">' . esc_html__( 'Delete', 'surecart' ) . '</a>',
						),
						function ( $action, $key ) use ( $referral ) {
							if ( 'approve' === $key && 'approved' === $referral->status ) {
								return false;
							}

							if ( 'deny' === $key && 'denied' === $referral->status ) {
								return false;
							}

							if ( 'make_reviewing' === $key && 'reviewing' === $referral->status ) {
								return false;
							}

							return true;
						},
						ARRAY_FILTER_USE_BOTH
					)
				)
			)
		?>
		<?php
		return ob_get_clean();
	}

	/**
	 * Handle the status column.
	 *
	 * @param \SureCart\Models\Referral $referral The Referral model.
	 *
	 * @return string
	 */
	public function column_status( $referral ) {
		$status_display = [
			'reviewing' => [
				'label' => __( 'Reviewing', 'surecart' ),
				'type'  => 'warning',
			],
			'paid'      => [
				'label' => __( 'Paid', 'surecart' ),
				'type'  => 'success',
			],
			'denied'    => [
				'label' => __( 'Denied', 'surecart' ),
				'type'  => 'danger',
			],
			'canceled'  => [
				'label' => __( 'Canceled', 'surecart' ),
				'type'  => 'info',
			],
			'approved'  => [
				'label' => __( 'Approved', 'surecart' ),
				'type'  => 'success',
			],
		];
		ob_start();
		?>
		<sc-tag type="<?php echo esc_attr( $status_display[ $referral->status ?? '' ]['type'] ?? '' ); ?>"><?php echo esc_html( $status_display[ $referral->status ?? '' ]['label'] ?? '' ); ?></sc-tag>
		<?php
		return ob_get_clean();
	}

	/**
	 * Handle the affiliate column.
	 *
	 * @param \SureCart\Models\Referral $referral The Referral model.
	 *
	 * @return string
	 */
	public function column_affiliate( $referral ) {
		$affiliation = $referral->affiliation ?? null;
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
	 * Handle the description column.
	 *
	 * @param \SureCart\Models\Referral $referral The Referral model.
	 *
	 * @return string
	 */
	public function column_description( $referral ) {
		return esc_html( $referral->description );
	}

	/**
	 * Handle the order column.
	 *
	 * @param \SureCart\Models\Referral $referral The Referral model.
	 *
	 * @return string
	 */
	public function column_order( $referral ) {
		$checkout = $referral->checkout ?? null;
		if ( empty( $checkout->id ) ) {
			return '_';
		}

		ob_start();
		?>
		<a aria-label="<?php echo esc_attr__( 'Edit Order', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'order', $checkout->order ) ); ?>">
			#<?php echo sanitize_text_field( $checkout->number ?? $checkout->order ); ?>
		</a>
		<?php
		return ob_get_clean();
	}

	/**
	 * Handle the commission column.
	 *
	 * @param \SureCart\Models\Referral $referral The Referral model.
	 *
	 * @return string
	 */
	public function column_commission( $referral ) {
		return '<sc-format-number type="currency" currency="' . $referral->currency . '" value="' . $referral->commission_amount . '"></sc-format-number>';
	}

	/**
	 * Get the table data
	 *
	 * @return \SureCart\Models\Collection;
	 */
	private function table_data() {
		return Referral::where(
			array(
				'query'  => $this->get_search_query(),
				'status' => [ $this->getFilteredStatus() ],
				'expand' => [
					'affiliation',
					'checkout',
				],
			)
		)->paginate(
			array(
				'per_page' => $this->get_items_per_page( 'affiliate_referrals' ),
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
		echo esc_html_e( 'No affiliate referrals found.', 'surecart' );
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
		if ( empty( $_GET['status'] ) || 'all' === $_GET['status'] ) {
			return null;
		}

		return sanitize_text_field( wp_unslash( $_GET['status'] ) );
	}

	/**
	 * Get all statuses.
	 *
	 * @return array
	 */
	private function getStatuses(): array {
		return array(
			'all'       => __( 'All', 'surecart' ),
			'reviewing' => __( 'Reviewing', 'surecart' ),
			'approved'  => __( 'Approved', 'surecart' ),
			'denied'    => __( 'Denied', 'surecart' ),
			'canceled'  => __( 'Canceled', 'surecart' ),
			'paid'      => __( 'Paid Out', 'surecart' ),
		);
	}

	/**
	 * Get action url.
	 *
	 * @param int    $id     The id.
	 * @param string $action The action.
	 *
	 * @return string
	 */
	public function get_action_url( $id, $action ) {
		return esc_url(
			add_query_arg(
				[
					'action' => $action,
					'nonce'  => wp_create_nonce( $action . '_affiliation' ),
					'id'     => $id,
				],
				esc_url_raw( admin_url( 'admin.php?page=sc-affiliate-referrals' ) )
			)
		);
	}
}
