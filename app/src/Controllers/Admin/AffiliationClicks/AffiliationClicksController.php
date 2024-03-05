<?php

namespace SureCart\Controllers\Admin\AffiliationClicks;

use SureCart\Controllers\Admin\AdminController;

/**
 * Handles affiliate requests admin routes.
 */
class AffiliationClicksController extends AdminController {
	/**
	 * Affiliate Requests index.
	 */
	public function index() {
		$table = new AffiliationClicksListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'affiliate_clicks' => [
					'title' => __( 'Affiliate Clicks', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/affiliation-clicks/index' )->with( [ 'table' => $table ] );
	}
}
