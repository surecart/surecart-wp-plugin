<?php

namespace SureCart\Controllers\Admin\Settings;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\SpaShellScriptsController;
use SureCart\Controllers\Admin\Products\ProductScriptsController;
use SureCart\Controllers\Admin\ProductCollections\ProductCollectionsScriptsController;

/**
 * Settings controller for the client-side routed settings.
 *
 * Now uses the unified SPA shell — the React-rendered SettingsPage component
 * handles the settings layout, header, and tab routing.
 */
class Settings extends AdminController {
	/**
	 * Enqueue scripts shared by all SPA routes.
	 *
	 * @return void
	 */
	private function enqueueSpaScripts() {
		remove_all_actions( 'admin_notices' );

		// Unified SPA shell (handles routing between Products, Collections, Settings, etc.).
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( SpaShellScriptsController::class, 'enqueue' ) );

		// Product edit page dependencies (block editor, media, etc.).
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( ProductScriptsController::class, 'enqueue' ) );

		// Product collections edit page dependencies.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( ProductCollectionsScriptsController::class, 'enqueue' ) );

		// Settings page dependencies (scData, scSettingsData, media, styles).
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( SettingsScriptsController::class, 'enqueue' ) );
	}

	/**
	 * Render the SPA shell view.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface
	 */
	private function renderSpaView() {
		// SureCart branded breadcrumb header — rendered in DOM so it's available
		// when SPA-navigating to list/detail pages (Products, Collections).
		$this->withHeader(
			array(
				'breadcrumbs' => [
					'settings' => [
						'title' => __( 'Settings', 'surecart' ),
					],
				],
			),
		);

		return \SureCart::view( 'admin/spa-shell' )->with(
			[
				'title' => __( 'Settings', 'surecart' ),
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
