<?php
namespace SureCart\Integrations\LearnDash;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the learnDash Service.
 */
class LearnDashServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		if ( $this->enabled() ) {
			$container['surecart.learndash.sync'] = function () {
				return new LearnDashService();
			};
		}
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		if ( $this->enabled() ) {
			$container['surecart.learndash.sync']->bootstrap();
		}
	}

	/**
	 * Is learndash enabled?
	 *
	 * @return boolean
	 */
	public function enabled() {
		return defined('LEARNDASH_VERSION');
	}
}
