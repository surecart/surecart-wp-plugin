<?php

namespace SureCart\Abilities;

use SureCart\Models\ApiToken;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Service provider for WordPress 6.9+ Abilities API integration.
 */
class AbilitiesServiceProvider implements ServiceProviderInterface {

	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.abilities.registrar'] = function () {
			return new AbilityRegistrar();
		};
	}

	/**
	 * Bootstrap the service.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		// Graceful degradation: do nothing if WP < 6.9 or Abilities API not available.
		if ( ! function_exists( 'wp_register_ability_category' ) ) {
			return;
		}

		// Don't register abilities if the store is not connected.
		if ( empty( ApiToken::get() ) ) {
			return;
		}

		// Don't register abilities if they are globally disabled.
		if ( ! get_option( 'surecart_mcp_abilities_enabled', true ) ) {
			return;
		}

		$registrar = $container['surecart.abilities.registrar'];

		// Pass toggle settings to the registrar so it can filter abilities.
		$registrar->set_settings(
			array(
				'edit_enabled'   => (bool) get_option( 'surecart_mcp_edit_abilities_enabled', true ),
				'delete_enabled' => (bool) get_option( 'surecart_mcp_delete_abilities_enabled', true ),
			)
		);

		add_action( 'wp_abilities_api_categories_init', array( $registrar, 'register_category' ) );
		add_action( 'wp_abilities_api_init', array( $registrar, 'register_abilities' ) );
	}
}
