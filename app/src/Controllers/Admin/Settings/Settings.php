<?php

namespace SureCart\Controllers\Admin\Settings;

use SureCart\Controllers\Admin\AdminController;

/**
 * Settings controller — standalone SPA entry.
 *
 * The settings-root.js bundle mounts SettingsPage on `#sc-settings-app`.
 * SettingsPage owns its RouterProvider and lazy-loads each tab.
 */
class Settings extends AdminController {
	/**
	 * Enqueue the settings SPA bundle.
	 *
	 * @return void
	 */
	private function enqueueSpaScripts() {
		remove_all_actions( 'admin_notices' );
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( SettingsScriptsController::class, 'enqueue' ) );
	}

	/**
	 * Render the settings view.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface
	 */
	private function renderSpaView() {

		return \SureCart::view( 'admin/settings-page' )->with(
			[
				'claim_url'     => ! \SureCart::account()->claimed ? \SureCart::routeUrl( 'account.claim' ) : '',
				'claim_expired' => \SureCart::account()->claim_expired ?? false,
				'breadcrumb'    => __( 'Settings', 'surecart' ),
			]
		);
	}

	/**
	 * Show the settings page.
	 *
	 * SPA entry point — React handles the settings layout, header, and tabs.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function show( \SureCartCore\Requests\RequestInterface $request ) {
		$this->enqueueSpaScripts();
		return $this->renderSpaView();
	}
}
