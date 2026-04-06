<?php

namespace SureCart\Controllers\Admin\Settings;

/**
 * Settings controller for the client-side routed settings SPA.
 */
class Settings extends BaseSettings {
	/**
	 * Script handles for the settings page.
	 *
	 * @var array
	 */
	protected $scripts = [
		'show' => [ 'surecart/scripts/admin/settings', 'admin/settings' ],
	];

	/**
	 * Show the settings page.
	 * Overrides BaseSettings::show() to skip unused API calls
	 * (entitlements, plan, brand_color, etc.) that the SPA view doesn't need.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function show( \SureCartCore\Requests\RequestInterface $request ) {
		remove_all_actions( 'admin_notices' );
		add_action( 'admin_enqueue_scripts', [ $this, 'showScripts' ] );

		return \SureCart::view( $this->template )->with(
			[
				'breadcrumb'    => '',
				'claim_url'     => ! \SureCart::account()->claimed ? \SureCart::routeUrl( 'account.claim' ) : '',
				'claim_expired' => \SureCart::account()->claim_expired ?? false,
			]
		);
	}

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
