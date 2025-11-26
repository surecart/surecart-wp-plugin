<?php

namespace SureCart\Controllers\Admin\Customers;

use SureCart\Models\Customer;
use SureCart\Controllers\Admin\Tables\ListTable;
use SureCart\Controllers\Admin\Tables\HasModeFilter;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class CustomersListTable extends ListTable {
	use HasModeFilter;

	/**
	 * The checkbox.
	 *
	 * @var bool
	 */
	public $checkbox = true;

	/**
	 * The error message.
	 *
	 * @var string
	 */
	public $error = '';

	/**
	 * The BulkActionService instance.
	 *
	 * @var \SureCart\Background\BulkActionService
	 */
	public $bulk_actions = null;

	/**
	 * Constructor.
	 *
	 * @param \SureCart\Background\BulkActionService $bulk_actions The BulkActionService instance.
	 */
	public function __construct( \SureCart\Background\BulkActionService $bulk_actions ) {
		parent::__construct();

		$this->bulk_actions = $bulk_actions;

		add_action( 'admin_notices', [ $this, 'show_bulk_action_admin_notice' ] );
	}

	/**
	 * Show bulk action admin notice.
	 */
	public function show_bulk_action_admin_notice() {
		$this->bulk_actions->showBulkActionAdminNotice( 'delete_customers' );
	}

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
				'per_page'    => $this->get_items_per_page( 'customerss' ),
			]
		);

		$this->items = $query->data;
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return array
	 */
	public function get_columns() {
		return array_merge(
			[
				'cb'      => '<input type="checkbox" />',
				'name'    => __( 'Name', 'surecart' ),
				'email'   => __( 'Email', 'surecart' ),
				'created' => __( 'Created', 'surecart' ),
				'mode'    => '',
			],
			parent::get_columns()
		);
	}

	/**
	 * Displays the checkbox column.
	 *
	 * @param Customer $customer The customer model.
	 */
	public function column_cb( $customer ) {
		?>
		<label class="screen-reader-text" for="cb-select-<?php echo esc_attr( $customer['id'] ); ?>"><?php esc_html_e( 'Select customer', 'surecart' ); ?></label>
		<input id="cb-select-<?php echo esc_attr( $customer['id'] ); ?>" type="checkbox" name="bulk_action_customer_ids[]" value="<?php echo esc_attr( $customer['id'] ); ?>" />
			<?php
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
	 * Define the sortable columns
	 *
	 * @return array
	 */
	public function get_sortable_columns() {
		return array( 'title' => array( 'title', false ) );
	}

	/**
	 * Get the table data
	 *
	 * @return object|\WP_Error
	 */
	private function table_data() {
		$mode       = sanitize_text_field( wp_unslash( $_GET['mode'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$conditions = array(
			'query' => $this->get_search_query(),
		);

		if ( ! empty( $mode ) ) {
			$conditions['live_mode'] = 'live' === $mode;
		}

		return Customer::where( $conditions )
		->paginate(
			[
				'per_page' => $this->get_items_per_page( 'customers' ),
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
		echo esc_html_e( 'No customers found.', 'surecart' );
	}

	/**
	 * The customer email.
	 *
	 * @param \SureCart\Models\Customer $customer The customer model.
	 *
	 * @return string
	 */
	public function column_email( $customer ) {
		return sanitize_email( $customer->email );
	}

	/**
	 * Name column
	 *
	 * @param \SureCart\Models\Customer $customer Customer model.
	 *
	 * @return string
	 */
	public function column_name( $customer ) {
		$pending_record_ids    = $this->bulk_actions->getRecordIds( 'delete_customers', 'pending' );
		$processing_record_ids = $this->bulk_actions->getRecordIds( 'delete_customers', 'processing' );
		$succeeded_record_ids  = $this->bulk_actions->getRecordIds( 'delete_customers', 'succeeded' );
		$bulk_status           = '';
		if ( ! empty( $pending_record_ids ) && in_array( $customer->id, $pending_record_ids, true ) ) {
			$bulk_status = 'pending';
		} elseif ( ! empty( $processing_record_ids ) && in_array( $customer->id, $processing_record_ids, true ) ) {
			$bulk_status = 'processing';
		} elseif ( ! empty( $succeeded_record_ids ) && in_array( $customer->id, $succeeded_record_ids, true ) ) {
			$bulk_status = 'succeeded';
		}

		ob_start();
		?>
		<a class="row-title" aria-label="<?php esc_attr_e( 'Edit Customer', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'customers', $customer->id ) ); ?>">
			<?php echo wp_kses_post( $customer->name ?? $customer->email ); ?>
		</a>

		<?php
		echo wp_kses_post( $this->getRowActions( $customer, $bulk_status ) );
		?>

		<?php
		return ob_get_clean();
	}

	/**
	 * Get row actions.
	 *
	 * @param \SureCart\Models\Customer $customer Customer model.
	 * @param string                    $bulk_status Bulk status.
	 *
	 * @return string
	 */
	public function getRowActions( $customer, $bulk_status ) {
		if ( 'succeeded' === $bulk_status ) {
			return '<div>' . esc_html__( 'Successfully deleted.', 'surecart' ) . '</div>';
		}

		if ( 'pending' === $bulk_status || 'processing' === $bulk_status ) {
			return '<div>' . esc_html__( 'Queued for deletion.', 'surecart' ) . '</div>';
		}

		return $this->row_actions(
			[
				'edit' => '<a href="' . esc_url( \SureCart::getUrl()->edit( 'customers', $customer->id ) ) . '" aria-label="' . esc_attr__( 'Edit Customer', 'surecart' ) . '">' . __( 'Edit', 'surecart' ) . '</a>',
			],
		);
	}

	/**
	 * Define what data to show on each column of the table
	 *
	 * @param Customer $customer Customer model.
	 * @param string   $column_name - Current column name.
	 *
	 * @return mixed
	 */
	public function column_default( $customer, $column_name ) {
		// Call the parent method to handle custom columns.
		parent::column_default( $customer, $column_name );

		switch ( $column_name ) {
			case 'description':
				return $customer->$column_name ?? '';
		}
	}

	/**
	 * Displays extra table navigation.
	 *
	 * @param string $which Top or bottom placement.
	 */
	protected function extra_tablenav( $which ) {
		?>
		<input type="hidden" name="page" value="sc-customers" />

		<div class="alignleft actions">
		<?php
		if ( 'top' === $which ) {
			ob_start();
			$this->mode_dropdown();

			/**
			 * Fires before the Filter button on the Posts and Pages list tables.
			 *
			 * The Filter button allows sorting by date and/or category on the
			 * Posts list table, and sorting by date on the Pages list table.
			 *
			 * @since 2.1.0
			 * @since 4.4.0 The `$post_type` parameter was added.
			 * @since 4.6.0 The `$which` parameter was added.
			 *
			 * @param string $post_type The post type slug.
			 * @param string $which     The location of the extra table nav markup:
			 *                          'top' or 'bottom' for WP_Posts_List_Table,
			 *                          'bar' for WP_Media_List_Table.
			 */
			do_action( 'restrict_manage_customers', $this->screen->post_type, $which );

			$output = ob_get_clean();

			if ( ! empty( $output ) ) {
				echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				submit_button( __( 'Filter' ), '', 'filter_action', false, array( 'id' => 'filter-by-mode-submit' ) );
			}
		}

		?>
		</div>

		<?php
		/**
		 * Fires immediately following the closing "actions" div in the tablenav
		 * for the affiliate referrals list table.
		 *
		 * @param string $which The location of the extra table nav markup: 'top' or 'bottom'.
		 */
		do_action( 'manage_customers_extra_tablenav', $which );
	}

	/**
	 * Get bulk actions.
	 *
	 * @return array
	 */
	protected function get_bulk_actions() {
		$actions           = array();
		$actions['delete'] = __( 'Delete permanently', 'surecart' );
		return $actions;
	}

	/**
	 * Gets the current action selected from the bulk actions dropdown.
	 *
	 * @return string|false The action name. False if no action was selected.
	 */
	public function current_action() {
		if ( ! empty( $_REQUEST['delete_all'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return 'delete_all';
		}

		return parent::current_action();
	}
}
