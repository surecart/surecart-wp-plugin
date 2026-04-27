<?php

namespace SureCart\Controllers\Admin\Learn;

use SureCart\Models\Processor;
use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Learn page scripts.
 */
class LearnScriptsController extends AdminModelEditController {
	/**
	 * What types of data to add the the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'currency', 'supported_currencies' ];

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/learn';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/settings/learn';

	/**
	 * Enqueue scripts with additional learn-specific data.
	 *
	 * @return void
	 */
	public function enqueue() {
		$this->data['processors']              = Processor::get();
		$this->data['brand_logo_url']          = \SureCart::account()->brand->logo_url ?? null;
		$this->data['brand_color']             = \SureCart::account()->brand->color ?? null;
		$this->data['shop_page_edit_url']      = \SureCart::pages()->getId( 'shop' )
			? admin_url( 'post.php?post=' . \SureCart::pages()->getId( 'shop' ) . '&action=edit' )
			: '';
		$this->data['dashboard_page_edit_url'] = \SureCart::pages()->getId( 'dashboard' )
			? admin_url( 'post.php?post=' . \SureCart::pages()->getId( 'dashboard' ) . '&action=edit' )
			: '';
		parent::enqueue();
	}
}
