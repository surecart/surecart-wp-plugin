<?php

namespace SureCart\Controllers\Admin\Settings;

use SureCart\Controllers\Admin\AdminController;

/**
 * Settings controller — standalone SPA entry.
 *
 * The settings-root.js bundle mounts SettingsApp on `#sc-settings-app`.
 * SettingsApp owns its RouterProvider and lazy-loads each tab.
 */
class Settings extends AdminController {
	/**
	 * Show the settings page.
	 *
	 * SPA entry point — React handles the settings layout, header, and tabs.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return \SureCartCore\Responses\ResponseInterface
	 */
	public function show( \SureCartCore\Requests\RequestInterface $request ) {
		remove_all_actions( 'admin_notices' );
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( SettingsScriptsController::class, 'enqueue' ) );

		return \SureCart::view( 'admin/settings-page' )->with(
			[
				'claim_url'     => ! \SureCart::account()->claimed ? \SureCart::routeUrl( 'account.claim' ) : '',
				'claim_expired' => \SureCart::account()->claim_expired ?? false,
				'breadcrumb'    => __( 'Settings', 'surecart' ),
			]
		);
	}

	/**
	 * Enqueue the scripts and styles for the settings.
	 *
	 * @return void
	 */
	public function enqueueScripts() {
		$handle = 'surecart/scripts/admin/settings';
		$path   = 'admin/settings';
		$deps   = [ 'sc-ui-data', 'wp-data', 'wp-core-data' ];

		wp_enqueue_media();
		wp_enqueue_style( 'wp-components' );
		wp_enqueue_style( 'wp-block-editor' );
		wp_enqueue_style( 'surecart-themes-default' );
		wp_enqueue_script( 'surecart-components' );
		wp_enqueue_script( 'wp-format-library' );
		wp_enqueue_style( 'wp-format-library' );

		// automatically load dependencies and version.
		$asset_file = include plugin_dir_path( SURECART_PLUGIN_FILE ) . "dist/$path.asset.php";

		wp_enqueue_script(
			$handle,
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . "dist/$path.js",
			array_merge( $asset_file['dependencies'], $deps ),
			$asset_file['version'],
			true
		);

		wp_set_script_translations( $handle, 'surecart' );

		wp_localize_script(
			$handle,
			'scData',
			[
				'supported_currencies'         => Currency::list(),
				'locales'                      => Currency::getLocales(),
				'app_url'                      => defined( 'SURECART_APP_URL' ) ? untrailingslashit( SURECART_APP_URL ) : 'https://app.surecart.com',
				'account_id'                   => \SureCart::account()->id,
				'account_slug'                 => \SureCart::account()->slug,
				'locale'                       => str_replace( '_', '-', get_locale() ),
				'api_url'                      => \SureCart::requests()->getBaseUrl(),
				'ajax_url'                     => admin_url( 'admin-ajax.php' ),
				'home_url'                     => esc_url_raw( home_url() ),
				'root_url'                     => esc_url_raw( get_rest_url() ),
				'plugin_installer_nonce'       => wp_create_nonce( 'updates' ),
				'currency'                     => \SureCart::account()->currency,
				'time_zones'                   => TimeDate::timezoneOptions(),
				'entitlements'                 => \SureCart::account()->entitlements,
				'brand_color'                  => \SureCart::account()->brand->color ?? null,
				'brand_logo_url'               => \SureCart::account()->brand->logo_url ?? null,
				'plan_name'                    => \SureCart::account()->plan->name ?? '',
				'processors'                   => Processor::get(),
				'is_block_theme'               => (bool) wp_is_block_theme(),
				'should_load_on_demand_assets' => (bool) \SureCart::theme()->shouldLoadOnDemandBlockAssets(),
				'claim_url'                    => ! \SureCart::account()->claimed ? \SureCart::routeUrl( 'account.claim' ) : '',
				'claim_expired'                => \SureCart::account()->claim_expired ?? false,
				'google_map_api_key'           => \SureCart::googleMaps()->getApiKey(),
				'shop_page_edit_url'           => \SureCart::pages()->getId( 'shop' )
					? admin_url( 'post.php?post=' . \SureCart::pages()->getId( 'shop' ) . '&action=edit' )
					: '',
				'dashboard_page_edit_url'      => \SureCart::pages()->getId( 'dashboard' )
					? admin_url( 'post.php?post=' . \SureCart::pages()->getId( 'dashboard' ) . '&action=edit' )
					: '',
			]
		);

		// Localize data needed by the React sidebar.
		wp_localize_script(
			$handle,
			'scSettingsData',
			[
				'has_api_token'           => (bool) \SureCart\Models\ApiToken::get(),
				'abilities_api_available' => function_exists( 'wp_register_ability_category' ),
			]
		);

		// Localize data for the MCP settings tab (client-side routed).
		wp_localize_script(
			$handle,
			'scMCPData',
			MCPSettings::getLocalizedData()
		);
	}
}
