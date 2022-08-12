<?php

namespace SureCart\Integrations\LearnDashGroup;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the learnDash Service.
 */
class LearnDashGroupServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.learndash.sync'] = function () {
			return new LearnDashGroupService();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.learndash.sync']->bootstrap();
	}
}
