<?php

namespace SureCart\Controllers\Admin\AffiliationRequests;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\AffiliationRequests\AffiliationRequestsListTable;

/**
 * Handles affiliate requests admin routes.
 */
class AffiliationRequestsController extends AdminController {
	/**
	 * Affiliate Requests index.
	 */
	public function index() {
		$table = new AffiliationRequestsListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'affiliate_requests' => [
					'title' => __( 'Affiliate Requests', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/affiliate-requests/index' )->with( [ 'table' => $table ] );
	}
}
