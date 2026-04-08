<?php

namespace SureCart\Controllers\Admin\Products;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Products List Page Scripts
 */
class ProductsListScriptsController extends AdminModelEditController {
	/**
	 * What types of data to add the the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'currency', 'links' ];

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/products-list';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/products-list';

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

		// Enqueue the DataViews imported styles (style-* CSS from @import).
		$style_css = 'admin/style-products-list.css';
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
