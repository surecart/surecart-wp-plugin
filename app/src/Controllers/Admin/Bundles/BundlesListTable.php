<?php

namespace SureCart\Controllers\Admin\Bundles;

use SureCart\Models\Product;
use SureCart\Controllers\Admin\Tables\ListTable;

/**
 * Bundles list table — lists products with `bundle: true`.
 */
class BundlesListTable extends ListTable {
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
				'per_page'    => $this->get_items_per_page( 'bundles' ),
			)
		);

		$this->items = $query->data;
	}

	/**
	 * Get views for the list table status links.
	 */
	protected function get_views() {
		$statuses = array(
			'active'   => __( 'Active', 'surecart' ),
			'archived' => __( 'Archived', 'surecart' ),
			'all'      => __( 'All', 'surecart' ),
		);

		$status_links = array();

		foreach ( $statuses as $status => $label ) {
			$link                    = admin_url( 'admin.php?page=sc-bundles' );
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

		return $status_links;
	}

	/**
	 * Define the columns to use in the listing table.
	 *
	 * @return array
	 */
	public function get_columns() {
		return array_merge(
			array_filter(
				array(
					'cb'                  => '<input type="checkbox" />',
					'name'                => __( 'Name', 'surecart' ),
					'price'               => __( 'Price', 'surecart' ),
					'bundle_items'        => __( 'Items', 'surecart' ),
					'commission_amount'   => __( 'Commission Amount', 'surecart' ),
					'integrations'        => __( 'Integrations', 'surecart' ),
					'product_collections' => __( 'Collections', 'surecart' ),
					'status'              => __( 'Product Page', 'surecart' ),
					'featured'            => __( 'Featured', 'surecart' ),
					'date'                => __( 'Created', 'surecart' ),
				)
			),
			parent::get_columns()
		);
	}

	/**
	 * Displays the checkbox column.
	 *
	 * @param Product $bundle The bundle model.
	 */
	public function column_cb( $bundle ) {
		?>
		<label class="screen-reader-text" for="cb-select-<?php echo esc_attr( $bundle['id'] ); ?>"><?php esc_html_e( 'Select bundle', 'surecart' ); ?></label>
		<input id="cb-select-<?php echo esc_attr( $bundle['id'] ); ?>" type="checkbox" name="bulk_action_product_ids[]" value="<?php echo esc_attr( $bundle['id'] ); ?>" />
			<?php
	}

	/**
	 * Show the number of bundle items.
	 *
	 * @param Product $bundle The bundle model.
	 */
	public function column_bundle_items( $bundle ) {
		$items = $bundle->bundle_items->data ?? array();
		$count = is_array( $items ) ? count( $items ) : 0;

		// translators: %d is the number of items in the bundle.
		$label = sprintf( _n( '%d item', '%d items', $count, 'surecart' ), $count );

		return sprintf(
			'<a href="%1$s">%2$s</a>',
			esc_url( \SureCart::getUrl()->edit( 'bundle', $bundle->id ) ),
			esc_html( $label )
		);
	}

	/**
	 * Show the affiliate commission amount.
	 *
	 * @param Product $bundle The bundle model.
	 */
	public function column_commission_amount( $bundle ) {
		return $bundle->commission_structure->commission_amount ?? '-';
	}

	/**
	 * Show collections as tags.
	 *
	 * @param Product $bundle The bundle model.
	 */
	public function column_product_collections( $bundle ) {
		$product_collections = $bundle->product_collections->data ?? array();

		if ( empty( $product_collections ) ) {
			return '-';
		}

		$product_collections_tags = array();

		foreach ( $product_collections as $product_collection ) {
			$product_collections_tags[] = '<a href="' . esc_url( admin_url( 'admin.php?page=sc-bundles&sc_collection=' . $product_collection['id'] ) ) . '">' . $product_collection['name'] . '</a>';
		}

		return implode( ', ', $product_collections_tags );
	}

	/**
	 * Show any integrations.
	 */
	public function column_integrations( $bundle ) {
		$list = $this->productIntegrationsList( [ 'product_id' => $bundle->id ] );
		return $list ? $list : '-';
	}

	/**
	 * Define which columns are hidden
	 *
	 * @return Array
	 */
	public function get_hidden_columns() {
		return ( is_array( get_user_meta( get_current_user_id(), 'managesurecart_page_sc-bundlescolumnshidden', true ) ) ) ? get_user_meta( get_current_user_id(), 'managesurecart_page_sc-bundlescolumnshidden', true ) : array();
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
	 * Get the table data.
	 *
	 * @return object|\WP_Error
	 */
	private function table_data() {
		$is_archived = $this->getArchiveStatus();

		$bundle_query = Product::where(
			array(
				'archived' => $is_archived,
				'bundle'   => true,
				'query'    => $this->get_search_query(),
				'cached'   => false,
			)
		)->with(
			array(
				'prices',
				'bundle_items',
				'bundle_items.component_product',
				'product_collections',
				'featured_product_media',
				'commission_structure',
			)
		);

		// Filter by collection if requested.
		if ( ! empty( $_GET['sc_collection'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$bundle_query->where(
				array(
					'product_collection_ids' => array( sanitize_text_field( wp_unslash( $_GET['sc_collection'] ) ) ),  // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				)
			);
		}

		// Sorting.
		$orderby = ! empty( $_GET['orderby'] ) ? sanitize_text_field( wp_unslash( $_GET['orderby'] ) ) : 'cataloged_at'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$order   = ! empty( $_GET['order'] ) ? sanitize_text_field( wp_unslash( $_GET['order'] ) ) : 'desc'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$order   = ( 'asc' === strtolower( $order ) ) ? 'asc' : 'desc';

		$sort_map = $this->get_sort_map();
		if ( isset( $sort_map[ $orderby ] ) ) {
			$bundle_query->where(
				array(
					'sort' => $sort_map[ $orderby ] . ':' . $order,
				)
			);
		}

		return $bundle_query->paginate(
			array(
				'per_page' => $this->get_items_per_page( 'bundles' ),
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
		esc_html_e( 'No bundles found.', 'surecart' );
	}

	/**
	 * Handle the price column.
	 *
	 * @param \SureCart\Models\Product $bundle Bundle model.
	 *
	 * @return string
	 */
	public function column_price( $bundle ) {
		return ! empty( $bundle->range_display_amount ) ? $bundle->range_display_amount : '-';
	}

	/**
	 * Handle the bundle cataloged date column.
	 *
	 * @param \SureCart\Models\Product $bundle Bundle model.
	 *
	 * @return string
	 */
	public function column_date( $bundle ) {
		return $bundle->cataloged_at_date_time;
	}

	/**
	 * Featured column.
	 *
	 * @param \SureCart\Models\Product $bundle Bundle model.
	 *
	 * @return string
	 */
	public function column_featured( $bundle ) {
		ob_start();
		?>
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="<?php echo $bundle->featured ? 'currentColor' : 'none'; ?>" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
			</svg>
		<?php
		return ob_get_clean();
	}

	/**
	 * Status column.
	 *
	 * @param \SureCart\Models\Product $bundle Bundle model.
	 *
	 * @return string
	 */
	public function column_status( $bundle ) {
		ob_start();
		$status = get_post_status_object( $bundle->post->post_status ?? '' );
		?>

		<?php if ( $status ) : ?>
			<sc-tag type="<?php echo ( 'publish' === $status->name ) ? 'success' : ''; ?>">
				<?php echo esc_html( $status->label ); ?>
			</sc-tag>
		<?php else : ?>

			<?php if ( 'published' === ( $bundle->status ?? '' ) ) : ?>
				<sc-tag type="success"><?php esc_html_e( 'Published', 'surecart' ); ?></sc-tag>
			<?php else : ?>
				<sc-tag><?php esc_html_e( 'Draft', 'surecart' ); ?></sc-tag>
			<?php endif; ?>
		<?php endif; ?>
		<?php
		return ob_get_clean();
	}

	/**
	 * Name column.
	 *
	 * @param \SureCart\Models\Product $bundle Bundle model.
	 *
	 * @return string
	 */
	public function column_name( $bundle ) {
		$pending_record_ids    = $this->bulk_actions->getRecordIds( 'delete_products', 'pending' );
		$processing_record_ids = $this->bulk_actions->getRecordIds( 'delete_products', 'processing' );
		$succeeded_record_ids  = $this->bulk_actions->getRecordIds( 'delete_products', 'succeeded' );
		$bulk_status           = '';
		if ( ! empty( $pending_record_ids ) && in_array( $bundle->id, $pending_record_ids ) ) {
			$bulk_status = 'pending';
		} elseif ( ! empty( $processing_record_ids ) && in_array( $bundle->id, $processing_record_ids ) ) {
			$bulk_status = 'processing';
		} elseif ( ! empty( $succeeded_record_ids ) && in_array( $bundle->id, $succeeded_record_ids ) ) {
			$bulk_status = 'succeeded';
		}

		ob_start();
		?>

		<div class="sc-product-name">
			<?php if ( ! empty( $bundle->featured_image ) ) { ?>
				<?php
				echo wp_kses_post( $bundle->featured_image->html( 'thumbnail' ) );
				?>
			<?php } else { ?>
			<div class="sc-product-image-preview">
				<svg xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			</div>
			<?php } ?>
		<div>
		<a class="row-title" aria-label="<?php esc_attr_e( 'Edit Bundle', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'bundle', $bundle->id ) ); ?>">
			<?php echo esc_html( $bundle->name ); ?>
		</a>

		<?php echo wp_kses_post( $this->getRowActions( $bundle, $bulk_status ) ); ?>
		</div>

		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get row actions.
	 *
	 * @param \SureCart\Models\Product $bundle Bundle model.
	 * @param string                   $bulk_status Bulk status.
	 *
	 * @return array
	 */
	public function getRowActions( $bundle, $bulk_status ) {
		if ( 'succeeded' === $bulk_status ) {
			return '<div>' . esc_html__( 'Successfully deleted.', 'surecart' ) . '</div>';
		}

		if ( 'pending' === $bulk_status || 'processing' === $bulk_status ) {
			return '<div>' . esc_html__( 'Queued for deletion.', 'surecart' ) . '</div>';
		}

		return $this->row_actions(
			array_filter(
				[
					'edit'        => '<a href="' . esc_url( \SureCart::getUrl()->edit( 'bundle', $bundle->id ) ) . '" aria-label="' . esc_attr__( 'Edit Bundle', 'surecart' ) . '">' . esc_html__( 'Edit', 'surecart' ) . '</a>',
					'trash'       => $this->action_toggle_archive( $bundle ),
					'view_bundle' => ! empty( $bundle->permalink ) ? '<a href="' . esc_url( $bundle->permalink ) . '" aria-label="' . esc_attr__( 'View', 'surecart' ) . '">' . esc_html__( 'View', 'surecart' ) . '</a>' : null,
					'duplicate'   => '<a href="' . esc_url( $this->duplicate_url( $bundle ) ) . '" aria-label="' . esc_attr__( 'Duplicate', 'surecart' ) . '">' . esc_html__( 'Duplicate', 'surecart' ) . '</a>',
				]
			)
		);
	}

	/**
	 * Build the toggle-archive URL for a bundle.
	 *
	 * The bundle routes reuse the `archive_model:product` middleware, so the
	 * nonce key must be `archive_product` even though the page slug is sc-bundles.
	 *
	 * @param \SureCart\Models\Product $bundle Bundle model.
	 * @return string
	 */
	protected function toggle_archive_url( $bundle ) {
		return add_query_arg(
			[
				'action' => 'toggle_archive',
				'nonce'  => wp_create_nonce( 'archive_product' ),
				'id'     => $bundle->id,
			],
			admin_url( 'admin.php?page=sc-bundles' )
		);
	}

	/**
	 * Build the duplicate URL for a bundle.
	 *
	 * @param \SureCart\Models\Product $bundle Bundle model.
	 * @return string
	 */
	protected function duplicate_url( $bundle ) {
		return add_query_arg(
			[
				'action' => 'duplicate',
				'nonce'  => wp_create_nonce( 'duplicate_product' ),
				'id'     => $bundle->id,
			],
			admin_url( 'admin.php?page=sc-bundles' )
		);
	}

	/**
	 * Toggle archive action link and text.
	 *
	 * @param \SureCart\Models\Product $bundle Bundle model.
	 * @return string
	 */
	public function action_toggle_archive( $bundle ) {
		$text            = $bundle->archived ? __( 'Un-Archive', 'surecart' ) : __( 'Archive', 'surecart' );
		$confirm_message = $bundle->archived ? __( 'Are you sure you want to restore this bundle? It will be available to purchase.', 'surecart' ) : __( 'Are you sure you want to archive this bundle? It will be unavailable for purchase.', 'surecart' );
		$link            = $this->toggle_archive_url( $bundle );

		return sprintf(
			'<a class="submitdelete" onclick="return confirm(\'%1s\')" href="%2s" aria-label="%3s">%4s</a>',
			esc_attr( $confirm_message ),
			esc_url( $link ),
			esc_attr__( 'Toggle Bundle Archive', 'surecart' ),
			esc_html( $text )
		);
	}

	/**
	 * Define what data to show on each column of the table.
	 *
	 * @param \SureCart\Models\Product $bundle Bundle model.
	 * @param string                   $column_name Current column name.
	 *
	 * @return mixed
	 */
	public function column_default( $bundle, $column_name ) {
		parent::column_default( $bundle, $column_name );

		switch ( $column_name ) {
			case 'name':
				return '<a href="' . \SureCart::getUrl()->edit( 'bundle', $bundle->id ) . '">' . $bundle->name . '</a>';
			case 'description':
				return $bundle->$column_name ?? '';
		}
	}

	/**
	 * Displays extra table navigation.
	 *
	 * @param string $which Top or bottom placement.
	 */
	protected function extra_tablenav( $which ) {
		?>
		<input type="hidden" name="page" value="sc-bundles" />

		<?php if ( ! empty( $_GET['status'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<input type="hidden" name="status" value="<?php echo esc_attr( $_GET['status'] ); ?>" />
		<?php endif; ?>

		<div class="alignleft actions">
		<?php
		if ( 'top' === $which ) {
			ob_start();
			$this->product_collection_dropdown();

			/**
			 * Fires before the Filter button on the bundle list tables.
			 *
			 * @param string $post_type The post type slug.
			 * @param string $which     The location of the extra table nav markup:
			 *                          'top' or 'bottom' for WP_Posts_List_Table,
			 *                          'bar' for WP_Media_List_Table.
			 */
			do_action( 'restrict_manage_bundles', $this->screen->post_type, $which );

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
		 * Fires immediately following the closing "actions" div in the tablenav
		 * for the bundles list table.
		 *
		 * @param string $which The location of the extra table nav markup: 'top' or 'bottom'.
		 */
		do_action( 'manage_bundles_extra_tablenav', $which );
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
	 * Displays a dropdown to filter by product collection.
	 *
	 * @access protected
	 */
	protected function product_collection_dropdown() {
		if ( apply_filters( 'surecart/disable_bundle_collection_dropdown', false ) ) {
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
