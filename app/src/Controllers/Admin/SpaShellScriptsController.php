<?php

namespace SureCart\Controllers\Admin;

use SureCart\Support\Scripts\AdminListDataviewController;

/**
 * SPA Shell Scripts — Enqueues the unified SPA shell bundle.
 *
 * This controller loads the single React bundle that handles all SPA-enabled
 * admin pages (Products, Collections, etc.) with client-side routing.
 */
class SpaShellScriptsController extends AdminListDataviewController {
	/**
	 * What types of data to add to the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'currency', 'supported_currencies', 'tax_protocol', 'checkout_page_url', 'links' ];

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/spa-shell';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/spa-shell';

	/**
	 * Add extra data needed by all SPA pages.
	 */
	public function __construct() {
		$this->data['api_url']         = \SureCart::requests()->getBaseUrl();
		$this->data['bulk_delete_url'] = admin_url( 'admin.php' );
	}

	/**
	 * Enqueue the scripts and all page-specific edit scripts.
	 *
	 * @return void
	 */
	public function enqueue() {
		// Pass available templates for products.
		$available_product_templates      = wp_get_theme()->get_page_templates( null, 'sc_product' );
		$available_product_templates['']  = apply_filters( 'default_page_template_title', __( 'Theme Layout', 'surecart' ), 'rest-api' );
		$this->data['availableTemplates'] = $available_product_templates;

		// Pass available templates for collections.
		$available_collection_templates             = wp_get_theme()->get_page_templates( null, 'sc_collection' );
		$available_collection_templates             = array_merge(
			$available_collection_templates,
			[
				apply_filters( 'default_page_template_title', __( 'Theme Layout', 'surecart' ), 'rest-api' ),
			]
		);
		$this->data['availableCollectionTemplates'] = $available_collection_templates;

		parent::enqueue();
	}
}
