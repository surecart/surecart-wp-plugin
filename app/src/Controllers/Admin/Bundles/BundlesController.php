<?php

namespace SureCart\Controllers\Admin\Bundles;

use SureCart\Controllers\Admin\Products\ProductsController;
use SureCart\Sync\ImportState;

/**
 * Handles bundle admin requests.
 *
 * A bundle is a Product with bundle:true, so the admin flow (index, edit,
 * archive, duplicate, sync, bulk delete) is reused from ProductsController.
 * This subclass overrides only what differs: page slug, URL key, view path,
 * ScriptsController/ListTable class refs, and the bundle-flavored copy
 * (notices, admin-bar label, bulk-delete strings).
 */
class BundlesController extends ProductsController {
	/**
	 * Constructor.
	 *
	 * Re-declared so the DI factory resolves `ImportState` for the subclass
	 * — auto-resolution skips inherited constructors. Bundles don't actually
	 * use the Woo import path (no `importResults` route on this controller),
	 * but parent::__construct() still needs the dependency to satisfy the
	 * type hint and keep $woo_import_state populated for any future hooks.
	 *
	 * @param ImportState $woo_import_state Import state for WooCommerce runs.
	 */
	public function __construct( ImportState $woo_import_state ) {
		parent::__construct( $woo_import_state );
	}

	/**
	 * Admin page slug used for redirects from this controller.
	 *
	 * @var string
	 */
	protected $page_slug = 'sc-bundles';

	/**
	 * Key passed to \SureCart::getUrl()->index().
	 *
	 * @var string
	 */
	protected $url_key = 'bundle';

	/**
	 * View path prefix (no trailing slash).
	 *
	 * @var string
	 */
	protected $view_prefix = 'admin/bundles';

	/**
	 * ScriptsController class enqueued on the edit screen.
	 *
	 * @var string
	 */
	protected $scripts_controller_class = BundleScriptsController::class;

	/**
	 * ListTable class used by index().
	 *
	 * @var string
	 */
	protected $list_table_class = BundlesListTable::class;

	/**
	 * Variable name the confirm-bulk-delete view expects in scope.
	 *
	 * @var string
	 */
	protected $bulk_delete_view_key = 'bundles';

	/**
	 * Index breadcrumb shape used by withHeader().
	 *
	 * @return array
	 */
	protected function indexBreadcrumb() {
		return array(
			'bundles' => array(
				'title' => __( 'Bundles', 'surecart' ),
			),
		);
	}

	/**
	 * Status-query → notice message map for the index page.
	 *
	 * @return array
	 */
	protected function indexNotices() {
		return array(
			'sync_success' => __( 'Bundle synced successfully.', 'surecart' ),
			'archived'     => __( 'Bundle archived.', 'surecart' ),
			'unarchived'   => __( 'Bundle unarchived.', 'surecart' ),
			'duplicated'   => __( 'Bundle duplicated successfully.', 'surecart' ),
		);
	}

	/**
	 * Admin-bar "View Bundle" link on the edit screen.
	 *
	 * @return array
	 */
	protected function adminBarViewEntry() {
		return array(
			'id'    => 'view-bundle-page',
			'title' => __( 'View Bundle', 'surecart' ),
		);
	}

	/**
	 * Message when bulk-delete is opened with no IDs selected.
	 *
	 * @return string
	 */
	protected function bulkDeleteEmptyMessage() {
		return __( 'No bundles selected. Please choose at least one bundle to delete.', 'surecart' );
	}

	/**
	 * Message when bulk-delete targets ids that no longer exist.
	 *
	 * @param int $count Number of ids requested for deletion.
	 *
	 * @return string
	 */
	protected function bulkDeleteAlreadyDeletedMessage( $count ) {
		return _n(
			'This bundle has already been deleted.',
			'These bundles have already been deleted.',
			$count,
			'surecart'
		);
	}

	/**
	 * Header title on the confirm-bulk-delete screen.
	 *
	 * @param int $count Number of items being deleted.
	 *
	 * @return string
	 */
	protected function bulkDeleteHeaderTitle( $count ) {
		return _n( 'Delete Bundle', 'Delete Bundles.', $count, 'surecart' );
	}
}
