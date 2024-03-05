<?php

namespace SureCart\Controllers\Admin\AffiliationReferrals;

use SureCart\Controllers\Admin\AdminController;

/**
 * Handles affiliate requests admin routes.
 */
class AffiliationReferralsController extends AdminController {
	/**
	 * Affiliate Requests index.
	 */
	public function index() {
		$table = new AffiliationReferralsListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'affiliate_referrals' => [
					'title' => __( 'Affiliate Referrals', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/affiliation-referrals/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Edit
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( AffiliationReferralsScriptsController::class, 'enqueue' ) );

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
