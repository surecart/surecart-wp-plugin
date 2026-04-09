<?php

namespace SureCart\Support\Scripts;

/**
 * Base class for DataView list pages.
 *
 * Extends AdminModelEditController with lighter dependencies (no editor/media)
 * and automatic CSS enqueuing for DataViews. Subclasses only need to declare
 * $handle, $path, and optionally $with_data — no CSS wiring needed.
 *
 * Usage:
 *   class OrdersListScriptsController extends AdminListDataviewController {
 *       protected $handle = 'surecart/scripts/admin/orders-list';
 *       protected $path   = 'admin/orders-list';
 *   }
 */
abstract class AdminListDataviewController extends AdminModelEditController {
	/**
	 * Override to skip heavy editor/media dependencies — list pages only need DataViews.
	 *
	 * Enqueues:
	 *  1. wp-components base styles.
	 *  2. Entity-specific CSS extracted by webpack (e.g. dist/admin/products-list.css).
	 *  3. Shared DataViews vendor CSS (dist/admin/style-dataview-vendor.css) — single
	 *     file shared across all list pages, registered once per page load.
	 *
	 * @return void
	 */
	public function enqueueScriptDependencies() {
		wp_enqueue_style( 'wp-components' );

		$dist_url  = trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/';
		$dist_path = plugin_dir_path( SURECART_PLUGIN_FILE ) . 'dist/';

		// Entity-specific SCSS styles (e.g. dist/admin/products-list.css).
		$base_css = $this->path . '.css';
		if ( file_exists( $dist_path . $base_css ) ) {
			wp_enqueue_style(
				$this->handle . '-base',
				$dist_url . $base_css,
				[ 'wp-components' ],
				filemtime( $dist_path . $base_css )
			);
		}

		// Shared DataViews vendor styles — single entry produced by the
		// dedicated admin/dataview-vendor webpack entry. Registered once with
		// a stable handle so it is not duplicated when multiple list pages load.
		$vendor_css = 'admin/style-dataview-vendor.css';
		if ( file_exists( $dist_path . $vendor_css ) ) {
			wp_enqueue_style(
				'surecart/styles/dataview-vendor',
				$dist_url . $vendor_css,
				[ 'wp-components' ],
				filemtime( $dist_path . $vendor_css )
			);
		}
	}
}
