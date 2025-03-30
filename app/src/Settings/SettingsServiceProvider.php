<?php

namespace SureCart\Settings;

use SureCart\Settings\SettingService;
use SureCart\WordPress\GoogleMapApiService;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register a session for Flash and OldInput to work with.
 */
class SettingsServiceProvider implements ServiceProviderInterface {
	/**
	 * Register settings service.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$app = $container[ SURECART_APPLICATION_KEY ];

		// Service for registering a setting.
		$container['surecart.settings'] = function () {
			return new SettingService();
		};

		// Google Map Validation Service.
		$container['surecart.settings.google_map'] = function () {
			return new GoogleMapApiService();
		};

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'settings', 'surecart.settings' );
		$app->alias( 'googleMaps', 'surecart.settings.google_map' );
	}


	/**
	 * Bootstrap settings.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.settings']->bootstrap();
		$container['surecart.settings.google_map']->bootstrap();
	}
}
