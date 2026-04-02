<?php

namespace SureCart\Controllers\Admin\Learn;

use SureCart\Controllers\Admin\AdminController;

/**
 * Handles learn admin page requests.
 */
class LearnController extends AdminController {

	/**
	 * Learn index.
	 */
	public function index() {
		// don't show admin notices on learn page.
		remove_all_actions( 'admin_notices' );

		// add header.
		$this->withHeader(
			[
				'breadcrumbs' => [
					[
						'title' => __( 'Learn', 'surecart' ),
					],
				],
			]
		);

		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( LearnScriptsController::class, 'enqueue' ) );

		// return view.
		return \SureCart::view( 'admin/learn-page' );
	}
}
