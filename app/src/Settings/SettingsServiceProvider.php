<?php

namespace CheckoutEngine\Settings;

use CheckoutEngine\Settings\SettingsService;
use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register a session for Flash and OldInput to work with.
 */
class SettingsServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$app = $container[ CHECKOUT_ENGINE_APPLICATION_KEY ];

		// Service for registering a setting.
		$container['surecart.settings'] = function () {
			return SettingsService::getInstance();
		};

		// register_setting alias.
		$app->alias(
			'register_setting',
			function () use ( $container ) {
				return call_user_func_array( [ $container['surecart.settings'], 'register' ], func_get_args() );
			}
		);

		// get registered settings alias.
		$app->alias(
			'get_registered_settings',
			function () use ( $container ) {
				return call_user_func_array( [ $container['surecart.settings'], 'getRegisteredSettings' ], func_get_args() );
			}
		);

		// register our settings from config.
		$config = $container[ CHECKOUT_ENGINE_CONFIG_KEY ];
		if ( ! empty( $config['settings'] ) ) {
			foreach ( $config['settings'] as $setting ) {
				$app->register_setting( $setting );
			}
		}
	}


	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {}
}
