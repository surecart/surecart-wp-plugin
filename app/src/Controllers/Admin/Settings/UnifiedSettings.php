<?php

namespace SureCart\Controllers\Admin\Settings;

/**
 * Unified settings controller for client-side routed settings SPA.
 * Replaces all individual per-tab settings controllers for the main render.
 */
class UnifiedSettings extends BaseSettings {
	/**
	 * Script handles for the unified settings page.
	 *
	 * @var array
	 */
	protected $scripts = [
		'show' => [ 'surecart/scripts/admin/settings', 'admin/settings' ],
	];

	/**
	 * Enqueue the show scripts with additional localized data for the SPA sidebar.
	 *
	 * @return void
	 */
	public function showScripts() {
		parent::showScripts();

		// Localize data needed by the React sidebar.
		wp_localize_script(
			$this->scripts['show'][0],
			'scSettingsData',
			[
				'has_api_token' => (bool) \SureCart\Models\ApiToken::get(),
				'show_learn'    => (bool) get_option( 'surecart_learn_admin_menu', true ),
			]
		);
	}
}
