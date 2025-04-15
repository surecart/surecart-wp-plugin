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
		$container['surecart.help_widget'] = function () {
			return new HelpWidget();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.help_widget']->bootstrap();
	}
}
