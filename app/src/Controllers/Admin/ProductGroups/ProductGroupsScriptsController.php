<?php

namespace SureCart\Controllers\Admin\ProductGroups;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Product Group Scripts
 */
class ProductGroupsScriptsController extends AdminModelEditController {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/product-groups';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/product-groups';

	/**
	 * Opt into the dataviews stylesheet enqueue (handled by the parent).
	 *
	 * @var bool
	 */
	protected $needs_dataviews_style = true;

	/**
	 * Enqueue the scripts.
	 *
	 * @return void
	 */
	public function enqueue(): void {
		$this->data['enhanced_admin_views_enabled'] = (bool) get_option( 'surecart_enhanced_admin_views', true );
		$this->data['modern_view_intro']            = \SureCart\Settings\SettingService::getModernViewIntroData();
		parent::enqueue();
	}
}
