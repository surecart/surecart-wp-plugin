<?php

namespace SureCart\Controllers\Admin\Affiliates;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\Affiliates\AffiliatesListTable;

/**
 * Handles affiliates admin routes.
 */
class AffiliatesController extends AdminController {
	/**
	 * Affiliates index.
	 */
	public function index() {
		$table = new AffiliatesListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'affiliates' => [
					'title' => __( 'Affiliates', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/affiliates/index' )->with( [ 'table' => $table ] );
	}
}
