<?php

namespace SureCart\Controllers\Admin\Affiliations;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\Affiliations\AffiliationsListTable;

/**
 * Handles Affiliation admin routes.
 */
class AffiliationsController extends AdminController {
	/**
	 * Affiliates index.
	 */
	public function index() {
		$table = new AffiliationsListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'affiliates' => [
					'title' => __( 'Affiliates', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/affiliations/index' )->with( [ 'table' => $table ] );
	}
}
