<?php

namespace SureCart\Controllers\Admin\Settings;

use SureCart\Models\Processor;
use SureCart\Support\Currency;
use SureCart\Support\TimeDate;

/**
 * Settings Scripts Controller — Enqueues the settings React bundle and its dependencies.
 *
 * Used by the unified SPA shell so Settings scripts are available
 * when SPA-navigating to the Settings page from other admin pages.
 *
 * Note: scData is already set by the SPA shell's parent controller
 * (AdminModelEditController). This class merges settings-specific
 * properties into scData using Object.assign, and sets scSettingsData
 * as a separate global.
 */
class SettingsScriptsController {
	/**
	 * Enqueue the settings scripts, styles, and localized data.
	 *
	 * @return void
	 */
	public function enqueue() {
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

		// Automatically load dependencies and version.
		$asset_file = include plugin_dir_path( SURECART_PLUGIN_FILE ) . "dist/$path.asset.php";

		wp_enqueue_script(
			$handle,
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . "dist/$path.js",
			array_merge( $asset_file['dependencies'], $deps ),
			$asset_file['version'],
			true
		);

		wp_register_script( 'suretriggers-sdk', 'https://app.ottokit.com/js/v2/embed.js', array(), '1.0.0', false );

		wp_set_script_translations( $handle, 'surecart' );

		// Merge settings-specific properties into scData (which is already set by
		// the SPA shell's AdminModelEditController base class). Using Object.assign
		// ensures we don't overwrite existing properties like upgrade_url, links, etc.
		$settings_sc_data = [
			'entitlements'                 => \SureCart::account()->entitlements,
			'supported_currencies'         => Currency::list(),
			'locales'                      => Currency::getLocales(),
			'app_url'                      => defined( 'SURECART_APP_URL' ) ? untrailingslashit( SURECART_APP_URL ) : 'https://app.surecart.com',
			'ajax_url'                     => admin_url( 'admin-ajax.php' ),
			'plugin_installer_nonce'       => wp_create_nonce( 'updates' ),
			'currency'                     => \SureCart::account()->currency,
			'time_zones'                   => TimeDate::timezoneOptions(),
			'brand_color'                  => \SureCart::account()->brand->color ?? null,
			'brand_logo_url'               => \SureCart::account()->brand->logo_url ?? null,
			'plan_name'                    => \SureCart::account()->plan->name ?? '',
			'processors'                   => Processor::get(),
			'should_load_on_demand_assets' => (bool) \SureCart::theme()->shouldLoadOnDemandBlockAssets(),
			'shop_page_edit_url'           => \SureCart::pages()->getId( 'shop' )
				? admin_url( 'post.php?post=' . \SureCart::pages()->getId( 'shop' ) . '&action=edit' )
				: '',
			'dashboard_page_edit_url'      => \SureCart::pages()->getId( 'dashboard' )
				? admin_url( 'post.php?post=' . \SureCart::pages()->getId( 'dashboard' ) . '&action=edit' )
				: '',
		];

		wp_add_inline_script(
			$handle,
			'window.scData = Object.assign(window.scData || {}, ' . wp_json_encode( $settings_sc_data ) . ');',
			'before'
		);

		// Localize settings-specific config (separate from scData).
		wp_localize_script(
			$handle,
			'scSettingsData',
			[
				'has_api_token'   => (bool) \SureCart\Models\ApiToken::get(),
				'show_learn'      => (bool) get_option( 'surecart_learn_admin_menu', true ),
				'logo_url'        => esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/logo.svg' ),
				'settings_url'    => esc_url( menu_page_url( 'sc-settings', false ) ),
				'cache_clear_url' => esc_url_raw( add_query_arg( [ 'cache' => 'clear' ], menu_page_url( 'sc-settings', false ) ) ),
				'cache_nonce'     => wp_create_nonce( 'update_plugin_settings' ),
				'version'         => \SureCart::plugin()->version(),
				'claim_url'       => ! \SureCart::account()->claimed ? \SureCart::routeUrl( 'account.claim' ) : '',
				'claim_expired'   => \SureCart::account()->claim_expired ?? false,
			]
		);
	}
}
