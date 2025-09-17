<?php

namespace SureCart\Integrations\HelpWidget;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provides the Survey service provider.
 */
class HelpWidgetServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.help_widget'] = function ( $container ) {
			return new HelpWidget();
		};

		$app = $container[ SURECART_APPLICATION_KEY ];

		$app->alias( 'helpWidget', 'surecart.help_widget' );
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		// not connected.
		if ( ! $container['surecart.account']->is_connected ) {
			return;
		}

		$container['surecart.help_widget']->bootstrap();
	}
}
