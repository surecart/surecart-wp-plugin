<?php

namespace SureCart\Controllers\Admin\Bundles;

use SureCart\Controllers\Admin\Products\ProductsListTable;

/**
 * Bundles list table.
 */
class BundlesListTable extends ProductsListTable {
	/**
	 * Admin page slug.
	 *
	 * @var string
	 */
	protected $page_slug = 'sc-bundles';

	/**
	 * URL key for \SureCart::getUrl()->edit() and related helpers.
	 *
	 * @var string
	 */
	protected $url_key = 'bundle';

	/**
	 * Per-page screen option key passed to get_items_per_page().
	 *
	 * @var string
	 */
	protected $per_page_key = 'bundles';

	/**
	 * User-meta key holding hidden columns for this screen.
	 *
	 * @var string
	 */
	protected $hidden_columns_meta_key = 'managesurecart_page_sc-bundlescolumnshidden';

	/**
	 * `bundle` value sent to Product::where() in table_data().
	 *
	 * @var bool
	 */
	protected $is_bundle = true;

	/**
	 * Extra `with` expansions specific to this screen.
	 *
	 * @var array
	 */
	protected $table_extra_with = array( 'bundle_items' );

	/**
	 * WP action fired before the Filter button in extra_tablenav top.
	 *
	 * @var string
	 */
	protected $restrict_manage_hook = 'restrict_manage_bundles';

	/**
	 * WP action fired after the closing actions div in extra_tablenav.
	 *
	 * @var string
	 */
	protected $extra_tablenav_hook = 'manage_bundles_extra_tablenav';

	/**
	 * Filter to disable the collection dropdown.
	 *
	 * @var string
	 */
	protected $collection_dropdown_disable_filter = 'surecart/disable_bundle_collection_dropdown';

	/**
	 * Screen-reader label for the row checkbox.
	 *
	 * @return string
	 */
	protected function selectAriaLabel() {
		return __( 'Select bundle', 'surecart' );
	}

	/**
	 * Display label for the "No items" empty state.
	 *
	 * @return string
	 */
	protected function noItemsLabel() {
		return __( 'No bundles found.', 'surecart' );
	}

	/**
	 * Aria-label used on the row "Edit" link.
	 *
	 * @return string
	 */
	protected function entityLabelEdit() {
		return __( 'Edit Bundle', 'surecart' );
	}

	/**
	 * Confirmation prompt shown when restoring (un-archiving) a bundle.
	 *
	 * @return string
	 */
	protected function archiveConfirmRestore() {
		return __( 'Are you sure you want to restore this bundle? It will be available to purchase.', 'surecart' );
	}

	/**
	 * Confirmation prompt shown when archiving a bundle.
	 *
	 * @return string
	 */
	protected function archiveConfirmArchive() {
		return __( 'Are you sure you want to archive this bundle? It will be unavailable for purchase.', 'surecart' );
	}

	/**
	 * Aria-label on the toggle-archive action.
	 *
	 * @return string
	 */
	protected function archiveAriaLabel() {
		return __( 'Toggle Bundle Archive', 'surecart' );
	}

	/**
	 * Entity columns.
	 *
	 * @return array
	 */
	protected function entityColumns() {
		return array(
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
		);
	}

	/**
	 * Show the number of bundle items.
	 *
	 * @param object $bundle The bundle model.
	 *
	 * @return string
	 */
	public function column_bundle_items( $bundle ) {
		$raw   = $bundle->bundle_items ?? array();
		$items = is_array( $raw ) ? $raw : ( $raw->data ?? array() );
		$count = is_array( $items ) ? count( $items ) : 0;

		// translators: %d is the number of items in the bundle.
		$label = sprintf( _n( '%d item', '%d items', $count, 'surecart' ), $count );

		return sprintf(
			'<a href="%1$s">%2$s</a>',
			esc_url( \SureCart::getUrl()->edit( $this->url_key, $bundle->id ) ),
			esc_html( $label )
		);
	}
}
