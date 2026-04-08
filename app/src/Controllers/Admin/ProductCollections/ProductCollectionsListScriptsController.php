<?php

namespace SureCart\Controllers\Admin\ProductCollections;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Product Collections List Page Scripts
 */
class ProductCollectionsListScriptsController extends AdminModelEditController {
	/**
	 * What types of data to add the the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'links' ];

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/product-collections-list';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/product-collections-list';

	/**
	 * Add the app url to the data.
	 */
	public function __construct() {
		$this->data['api_url'] = \SureCart::requests()->getBaseUrl();
	}

	/**
	 * Override to skip heavy editor dependencies — we only need DataViews.
	 *
	 * @return void
	 */
	public function enqueueScriptDependencies() {
		wp_enqueue_style( 'wp-components' );

		$dist_url  = trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/';
		$dist_path = plugin_dir_path( SURECART_PLUGIN_FILE ) . 'dist/';

		// Enqueue the DataViews base CSS (webpack-extracted import styles).
		$base_css = $this->path . '.css';
		if ( file_exists( $dist_path . $base_css ) ) {
			wp_enqueue_style(
				$this->handle . '-base',
				$dist_url . $base_css,
				[ 'wp-components' ],
				filemtime( $dist_path . $base_css )
			);
		}

		// Shared DataViews vendor styles — produced by the dedicated admin/dataview-vendor entry.
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
