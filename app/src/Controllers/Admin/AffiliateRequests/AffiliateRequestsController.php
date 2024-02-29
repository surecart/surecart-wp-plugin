<?php

namespace SureCart\Controllers\Admin\AffiliateRequests;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\AffiliateRequests\AffiliateRequestsListTable;

/**
 * Handles affiliate requests admin routes.
 */
class AffiliateRequestsController extends AdminController {
	/**
	 * Affiliate Requests index.
	 */
	public function index() {
		$table = new AffiliateRequestsListTable();
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
