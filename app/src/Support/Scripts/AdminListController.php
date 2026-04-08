<?php

namespace SureCart\Support\Scripts;

/**
 * Base class for DataView list pages.
 *
 * Extends AdminModelEditController with lighter dependencies (no editor/media)
 * and automatic CSS enqueuing for DataViews.
 *
 * Usage:
 *   class OrdersListScriptsController extends AdminListController {
 *       protected $handle = 'surecart/scripts/admin/orders-list';
 *       protected $path   = 'admin/orders-list';
 *   }
 */
abstract class AdminListController extends AdminModelEditController {
	/**
	 * Override to skip heavy editor/media dependencies — list pages only need DataViews.
	 *
	 * @return void
	 */
	public function enqueueScriptDependencies() {
		wp_enqueue_style( 'wp-components' );

		$dist_url  = trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/';
		$dist_path = plugin_dir_path( SURECART_PLUGIN_FILE ) . 'dist/';

		// Entity-specific SCSS styles (e.g. admin/products-list.css).
		$base_css = $this->path . '.css';
		if ( file_exists( $dist_path . $base_css ) ) {
			wp_enqueue_style(
				$this->handle . '-base',
				$dist_url . $base_css,
				[ 'wp-components' ],
				filemtime( $dist_path . $base_css )
			);
		}

		// Vendor/imported styles (e.g. admin/style-products-list.css).
		$slug      = basename( $this->path );
		$style_css = dirname( $this->path ) . '/style-' . $slug . '.css';
		if ( file_exists( $dist_path . $style_css ) ) {
			wp_enqueue_style(
				$this->handle . '-vendor',
				$dist_url . $style_css,
				[ 'wp-components' ],
				filemtime( $dist_path . $style_css )
			);
		}
	}
}
