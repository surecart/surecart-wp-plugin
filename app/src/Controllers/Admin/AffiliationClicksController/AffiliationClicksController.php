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

	/**
	 * Edit
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( AffiliationClicksScriptsController::class, 'enqueue' ) );

		$this->preloadPaths(
			[
				'/wp/v2/users/me',
				'/wp/v2/types?context=view',
				'/wp/v2/types?context=edit',
				'/surecart/v1/affiliation_clicks/' . $request->query( 'id' ) . '?context=edit',
			]
		);

		// return view.
		return '<div id="app"></div>';
	}
}
