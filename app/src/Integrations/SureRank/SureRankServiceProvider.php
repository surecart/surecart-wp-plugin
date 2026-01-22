<?php

namespace SureCart\Integrations\SureRank;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the SureRank integration.
 */
class SureRankServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.plugins.sure_rank'] = function () {
			return new SureRankService();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.plugins.sure_rank']->bootstrap();
	}
}
