<?php

namespace SureCart\Controllers\Admin\Products;

use SureCart\Models\Product;
use SureCart\Controllers\Admin\Tables\ListTable;

/**
 * WP_List_Table for Products.
 */
class ProductsListTable extends ListTable {
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
	 * The list of pages.
	 *
	 * @var array
	 */
	public $pages = array();

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
		$this->bulk_actions->showBulkActionAdminNotice( 'delete_products' );
	}

	/**
	 * Admin page slug.
	 *
	 * @var string
	 */
	protected $page_slug = 'sc-products';

	/**
	 * URL key for \SureCart::getUrl()->edit() and related helpers.
	 *
	 * @var string
	 */
	protected $url_key = 'product';

	/**
	 * Per-page screen option key passed to get_items_per_page().
	 *
	 * @var string
	 */
	protected $per_page_key = 'products';

	/**
	 * User-meta key holding hidden columns for this screen.
	 *
	 * @var string
	 */
	protected $hidden_columns_meta_key = 'managesurecart_page_sc-productscolumnshidden';

	/**
	 * `bundle` value sent to Product::where() in table_data().
	 *
	 * @var bool
	 */
	protected $is_bundle = false;

	/**
	 * Extra `with` expansions specific to this screen.
	 *
	 * @var array
	 */
	protected $table_extra_with = array();

	/**
	 * WP action fired before the Filter button in extra_tablenav top.
	 *
	 * @var string
	 */
	protected $restrict_manage_hook = 'restrict_manage_products';

	/**
	 * WP action fired after the closing actions div in extra_tablenav.
	 *
	 * @var string
	 */
	protected $extra_tablenav_hook = 'manage_products_extra_tablenav';

	/**
	 * Filter to disable the collection dropdown.
	 *
	 * @var string
	 */
	protected $collection_dropdown_disable_filter = 'surecart/disable_product_collection_dropdown';

	/**
	 * Screen-reader label for the row checkbox. Subclasses may override.
	 *
	 * @return string
	 */
	protected function selectAriaLabel() {
		return __( 'Select product', 'surecart' );
	}

	/**
	 * Display label for the "No items" empty state.
	 *
	 * @return string
	 */
	protected function noItemsLabel() {
		return __( 'No products found.', 'surecart' );
	}

	/**
	 * Aria-label used on the row "Edit" link.
	 *
	 * @return string
	 */
	protected function entityLabelEdit() {
		return __( 'Edit Product', 'surecart' );
	}

	/**
	 * Confirmation prompt shown when restoring (un-archiving) an item.
	 *
	 * @return string
	 */
	protected function archiveConfirmRestore() {
		return __( 'Are you sure you want to restore this product? This will be be available to purchase.', 'surecart' );
	}

	/**
	 * Confirmation prompt shown when archiving an item.
	 *
	 * @return string
	 */
	protected function archiveConfirmArchive() {
		return __( 'Are you sure you want to archive this product? This will be unavailable for purchase.', 'surecart' );
	}

	/**
	 * Aria-label on the toggle-archive action.
	 *
	 * @return string
	 */
	protected function archiveAriaLabel() {
		return __( 'Toggle Product Archive', 'surecart' );
	}

	/**
	 * Build the toggle-archive URL for a row.
	 *
	 * @param object $item The row model.
	 *
	 * @return string
	 */
	protected function toggleArchiveUrl( $item ) {
		return \SureCart::getUrl()->toggleArchive( $this->url_key, $item->id );
	}

	/**
	 * Build the duplicate URL for a row.
	 *
	 * @param object $item The row model.
	 *
	 * @return string
	 */
	protected function duplicateUrl( $item ) {
		return \SureCart::getUrl()->duplicate( $this->url_key, $item->id );
	}

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
				'per_page'    => $this->get_items_per_page( $this->per_page_key ),
			)
		);

		$this->items = is_array( $query->data ) ? $query->data : array();
	}

	/**
	 * Get views for the list table status links.
	 *
	 * @global int $post_id
	 * @global string $comment_status
	 * @global string $comment_type
	 */
	protected function get_views() {
		$statuses = array(
			'active'   => __( 'Active', 'surecart' ),
			'archived' => __( 'Archived', 'surecart' ),
			'all'      => __( 'All', 'surecart' ),
		);

		foreach ( $statuses as $status => $label ) {
			$link                    = admin_url( 'admin.php?page=' . $this->page_slug );
			$current_link_attributes = '';

			if ( ! empty( $_GET['status'] ) ) {
				if ( $status === $_GET['status'] ) {
					$current_link_attributes = ' class="current" aria-current="page"';
				}
			} elseif ( 'active' === $status ) {
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
			array_filter( $this->entityColumns() ),
			parent::get_columns()
		);
	}

	/**
	 * Entity-specific column map.
	 *
	 * @return array
	 */
	protected function entityColumns() {
		return array(
			'cb'                  => '<input type="checkbox" />',
			'name'                => __( 'Name', 'surecart' ),
			'price'               => __( 'Price', 'surecart' ),
			'commission_amount'   => __( 'Commission Amount', 'surecart' ),
			'quantity'            => __( 'Stock', 'surecart' ),
			'integrations'        => __( 'Integrations', 'surecart' ),
			'product_collections' => __( 'Collections', 'surecart' ),
			'status'              => __( 'Product Page', 'surecart' ),
			'featured'            => __( 'Featured', 'surecart' ),
			'sync_status'         => isset( $_GET['debug'] ) ? __( 'Sync Status', 'surecart' ) : null,
			'date'                => __( 'Created', 'surecart' ),
		);
	}

	/**
	 * Displays the checkbox column.
	 *
	 * @param Product $product The product model.
	 */
	public function column_cb( $product ) {
		?>
		<label class="screen-reader-text" for="cb-select-<?php echo esc_attr( $product['id'] ); ?>"><?php echo esc_html( $this->selectAriaLabel() ); ?></label>
		<input id="cb-select-<?php echo esc_attr( $product['id'] ); ?>" type="checkbox" name="bulk_action_product_ids[]" value="<?php echo esc_attr( $product['id'] ); ?>" />
		<?php
	}

	/**
	 * Show the sync status.
	 *
	 * @param Product $product The product model.
	 */
	public function column_sync_status( $product ) {
		if ( $product->synced ) {
			return '<sc-icon name="check" class="synced"></sc-icon>';
		}

		if ( \SureCart::sync()->products()->isActive() || \SureCart::sync()->product()->isScheduled( $product ) ) {
			return '<span class="syncing-wrapper"><sc-icon name="loader" class="syncing"></sc-icon><span class="syncing-text">' . __( 'Syncing...', 'surecart' ) . '</span></span>';
		}

		return '<sc-icon name="x" class="unsynced"></sc-icon>';
	}

	/**
	 * Show the quantity.
	 *
	 * @param Product $product The product model.
	 */
	public function column_quantity( $product ) {
		// translators: %d is the number of available stock.
		return $product->stock_enabled ? sprintf( __( '%d Available', 'surecart' ), $product->available_stock ) : '∞';
	}

	/**
	 * Show the affiliate commission amount.
	 *
	 * @param Product $product The product model.
	 */
	public function column_commission_amount( $product ) {
		return $product->commission_structure->commission_amount ?? '-';
	}

	/**
	 * Show collections as tags.
	 *
	 * @param Product $product The product model.
	 */
	public function column_product_collections( $product ) {
		$product_collections = $product->product_collections->data ?? array();

		// this has no collection.
		if ( empty( $product_collections ) ) {
			return '-';
		}

		$product_collections_tags = array();

		foreach ( $product_collections as $product_collection ) {
			$product_collections_tags[] = '<a href="' . esc_url( admin_url( 'admin.php?page=' . $this->page_slug . '&sc_collection=' . $product_collection['id'] ) ) . '">' . esc_html( $product_collection['name'] ) . '</a>';
		}

		return implode( ', ', $product_collections_tags );
	}

	/**
	 * Show any integrations.
	 */
	public function column_integrations( $product ) {
		$list = $this->productIntegrationsList( [ 'product_id' => $product->id ] );
		return $list ? $list : '-';
	}

	/**
	 * Define which columns are hidden
	 *
	 * @return Array
	 */
	public function get_hidden_columns() {
		$meta = get_user_meta( get_current_user_id(), $this->hidden_columns_meta_key, true );
		return is_array( $meta ) ? $meta : array();
	}

	/**
	 * Define the sortable columns
	 *
	 * @return array
	 */
	public function get_sortable_columns() {
		return array(
			'name' => array( 'name', true ),
			'date' => array( 'cataloged_at', true ),
		);
	}

	/**
	 * Get the sort map.
	 *
	 * @return array
	 */
	public function get_sort_map(): array {
		return array_merge(
			array(
				'name'         => 'name',
				'cataloged_at' => 'cataloged_at',
			),
			parent::get_sort_map()
		);
	}

	/**
	 * Get the table data
	 *
	 * @return array|\WP_Error
	 */
	protected function table_data() {
		$is_archived = $this->getArchiveStatus();

		$with = array_merge(
			array(
				'prices',
				'product_collections',
				'featured_product_media',
				'product.product_medias',
				'product_media.media',
				'commission_structure',
			),
			$this->table_extra_with
		);

		$product_query = Product::where(
			array(
				'archived' => $is_archived,
				'bundle'   => $this->is_bundle,
				'query'    => $this->get_search_query(),
				'cached'   => false,
			)
		)->with( $with );

		// Check if there is any sc_collection. If so, query by taxonomy.
		if ( ! empty( $_GET['sc_collection'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$product_query->where(
				array(
					'product_collection_ids' => array( sanitize_text_field( wp_unslash( $_GET['sc_collection'] ) ) ),  // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				)
			);
		}

		// Add sorting parameters.
		$orderby = ! empty( $_GET['orderby'] ) ? sanitize_text_field( wp_unslash( $_GET['orderby'] ) ) : 'cataloged_at'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$order   = ! empty( $_GET['order'] ) ? sanitize_text_field( wp_unslash( $_GET['order'] ) ) : 'desc'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$order   = ( 'asc' === strtolower( $order ) ) ? 'asc' : 'desc';

		// Apply sort parameter if valid.
		$sort_map = $this->get_sort_map();
		if ( isset( $sort_map[ $orderby ] ) ) {
			$product_query->where(
				array(
					'sort' => $sort_map[ $orderby ] . ':' . $order,
				)
			);
		}

		return $product_query->paginate(
			array(
				'per_page' => $this->get_items_per_page( $this->per_page_key ),
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
		echo esc_html( $this->noItemsLabel() );
	}

	/**
	 * Handle the type column output.
	 *
	 * @param \SureCart\Models\Product $product Product model.
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
		return ! empty( $product->range_display_amount ) ? $product->range_display_amount : '-';
	}

	/**
	 * Handle the product cataloged date column.
	 *
	 * @param \SureCart\Models\Product $product Product model.
	 *
	 * @return string
	 */
	public function column_date( $product ) {
		return $product->cataloged_at_date_time;
	}

	/**
	 * Published column
	 *
	 * @param \SureCart\Models\Product $product Product model.
	 *
	 * @return string
	 */
	public function column_featured( $product ) {
		ob_start();
		?>
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="<?php echo $product->featured ? 'currentColor' : 'none'; ?>" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
			</svg>
		<?php
		return ob_get_clean();
	}

	/**
	 * Published column
	 *
	 * @param \SureCart\Models\Product $product Product model.
	 *
	 * @return string
	 */
	public function column_status( $product ) {
		ob_start();
		$status = get_post_status_object( $product->post->post_status ?? '' );
		?>

		<?php if ( $status ) : ?>
			<sc-tag type="<?php echo ( 'publish' === $status->name ) ? 'success' : ''; ?>">
				<?php echo esc_html( $status->label ); ?>
			</sc-tag>
		<?php else : ?>

			<?php if ( 'published' === ( $product->status ?? '' ) ) : ?>
				<sc-tag type="success"><?php esc_html_e( 'Published', 'surecart' ); ?></sc-tag>
			<?php else : ?>
				<sc-tag><?php esc_html_e( 'Draft', 'surecart' ); ?></sc-tag>
			<?php endif; ?>
		<?php endif; ?>
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
		$pending_record_ids    = $this->bulk_actions->getRecordIds( 'delete_products', 'pending' );
		$processing_record_ids = $this->bulk_actions->getRecordIds( 'delete_products', 'processing' );
		$succeeded_record_ids  = $this->bulk_actions->getRecordIds( 'delete_products', 'succeeded' );
		$bulk_status           = '';
		if ( ! empty( $pending_record_ids ) && in_array( $product->id, $pending_record_ids ) ) {
			$bulk_status = 'pending';
		} elseif ( ! empty( $processing_record_ids ) && in_array( $product->id, $processing_record_ids ) ) {
			$bulk_status = 'processing';
		} elseif ( ! empty( $succeeded_record_ids ) && in_array( $product->id, $succeeded_record_ids ) ) {
			$bulk_status = 'succeeded';
		}

		ob_start();
		?>

		<div class="sc-product-name">
		<?php if ( ! empty( $product->featured_image ) ) { ?>
				<?php
				echo wp_kses_post( $product->featured_image->html( 'thumbnail' ) );
				?>
			<?php } else { ?>
			<div class="sc-product-image-preview">
				<svg xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			</div>
			<?php } ?>
		<div>
		<a class="row-title" aria-label="<?php echo esc_attr( $this->entityLabelEdit() ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( $this->url_key, $product->id ) ); ?>">
				<?php echo esc_html( $product->name ); ?>
		</a>

			<?php echo wp_kses_post( $this->getRowActions( $product, $bulk_status ) ); ?>
		</div>

		</div>
			<?php
			return ob_get_clean();
	}

	/**
	 * Get row actions.
	 *
	 * @param \SureCart\Models\Product $product Product model.
	 * @param string                   $bulk_status Bulk status.
	 *
	 * @return array
	 */
	public function getRowActions( $product, $bulk_status ) {
		if ( 'succeeded' === $bulk_status ) {
			return '<div>' . esc_html__( 'Successfully deleted.', 'surecart' ) . '</div>';
		}

		if ( 'pending' === $bulk_status || 'processing' === $bulk_status ) {
			return '<div>' . esc_html__( 'Queued for deletion.', 'surecart' ) . '</div>';
		}

		return $this->row_actions(
			array_filter(
				[
					'edit'         => '<a href="' . esc_url( \SureCart::getUrl()->edit( $this->url_key, $product->id ) ) . '" aria-label="' . esc_attr( $this->entityLabelEdit() ) . '">' . esc_html__( 'Edit', 'surecart' ) . '</a>',
					'trash'        => $this->action_toggle_archive( $product ),
					'sync'         => isset( $_GET['debug'] ) ? '<a href="' . esc_url( \SureCart::getUrl()->sync( $this->url_key, $product->id ) ) . '" aria-label="' . esc_attr__( 'Sync Product', 'surecart' ) . '">' . esc_html__( 'Sync', 'surecart' ) . '</a>' : null,
					'view_product' => ! empty( $product->permalink ) ? '<a href="' . esc_url( $product->permalink ) . '" aria-label="' . esc_attr__( 'View', 'surecart' ) . '">' . esc_html__( 'View', 'surecart' ) . '</a>' : null,
					'duplicate'    => '<a href="' . esc_url( $this->duplicateUrl( $product ) ) . '" aria-label="' . esc_attr__( 'Duplicate', 'surecart' ) . '">' . esc_html__( 'Duplicate', 'surecart' ) . '</a>',
				]
			)
		);
	}

	/**
	 * Toggle archive action link and text.
	 *
	 * @param \SureCart\Models\Product $product Product model.
	 * @return string
	 */
	public function action_toggle_archive( $product ) {
		$text            = $product->archived ? __( 'Un-Archive', 'surecart' ) : __( 'Archive', 'surecart' );
		$confirm_message = $product->archived ? $this->archiveConfirmRestore() : $this->archiveConfirmArchive();
		$link            = $this->toggleArchiveUrl( $product );

		return sprintf(
			'<a class="submitdelete" onclick="return confirm(\'%1s\')" href="%2s" aria-label="%3s">%4s</a>',
			esc_attr( $confirm_message ),
			esc_url( $link ),
			esc_attr( $this->archiveAriaLabel() ),
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
		// Call the parent method to handle custom columns.
		parent::column_default( $product, $column_name );

		switch ( $column_name ) {
			case 'name':
				return '<a href="' . esc_url( \SureCart::getUrl()->edit( $this->url_key, $product->id ) ) . '">' . esc_html( $product->name ) . '</a>';
			case 'description':
				return esc_html( $product->$column_name ?? '' );
		}
	}

	/**
	 * Displays extra table navigation.
	 *
	 * @param string $which Top or bottom placement.
	 */
	protected function extra_tablenav( $which ) {
		?>
		<input type="hidden" name="page" value="<?php echo esc_attr( $this->page_slug ); ?>" />

		<?php if ( ! empty( $_GET['status'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<input type="hidden" name="status" value="<?php echo esc_attr( $_GET['status'] ); ?>" />
		<?php endif; ?>

		<div class="alignleft actions">
		<?php
		if ( 'top' === $which ) {
			ob_start();
			$this->product_collection_dropdown();

			/**
			 * Fires before the Filter button on the product/bundle list tables.
			 *
			 * @param string $post_type The post type slug.
			 * @param string $which     The location of the extra table nav markup.
			 */
			do_action( $this->restrict_manage_hook, $this->screen->post_type, $which );

			$output = ob_get_clean();

			if ( ! empty( $output ) ) {
				echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				submit_button( __( 'Filter', 'surecart' ), '', 'filter_action', false, array( 'id' => 'filter-by-collection-submit' ) );
			}
		}
		?>
		</div>

		<?php
		/**
		 * Fires immediately following the closing "actions" div in the tablenav.
		 * Subclasses override `extraTablenavHook()` to fire their own variant.
		 *
		 * @param string $which The location of the extra table nav markup.
		 */
		do_action( $this->extra_tablenav_hook, $which );
	}

	/**
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
		if ( ! empty( $_REQUEST['delete_all'] ) ) {
			return 'delete_all';
		}

		return parent::current_action();
	}

	/**
	 * Displays a a dropdown to filter by product collection.
	 *
	 * @access protected
	 */
	protected function product_collection_dropdown() {
		/**
		 * Filter whether to remove the collection dropdown from the list table.
		 *
		 * @param bool $disable Whether to disable the drop-down. Default false.
		 */
		if ( apply_filters( $this->collection_dropdown_disable_filter, false ) ) {
			return;
		}

		$product_collections = get_terms(
			[
				'taxonomy'   => 'sc_collection',
				'hide_empty' => true,
			]
		);

		$displayed_collection = isset( $_GET['sc_collection'] ) ? sanitize_text_field( wp_unslash( $_GET['sc_collection'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		?>

		<label for="filter-by-collection" class="screen-reader-text">
			<?php esc_html_e( 'Filter by Product Collection', 'surecart' ); ?>
		</label>
		<select name="sc_collection" id="filter-by-collection">
			<option <?php selected( $displayed_collection, '' ); ?> value=""><?php esc_html_e( 'All Product Collections', 'surecart' ); ?></option>
			<?php foreach ( $product_collections as $term ) : ?>
				<?php $value = get_term_meta( $term->term_id, 'sc_id', true ); ?>
				<option <?php selected( $displayed_collection, $value ); ?> value="<?php echo esc_attr( $value ); ?>"><?php echo esc_html( $term->name ); ?></option>
			<?php endforeach; ?>
		</select>
		<?php
	}
}
