<?php

namespace SureCart\Integrations\RankMath;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the Rank Math integration.
 */
class RankMathServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.plugins.rank_math'] = function () {
			return new RankMathService();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.plugins.rank_math']->bootstrap();
	}
}
