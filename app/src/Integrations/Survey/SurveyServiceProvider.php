<?php

namespace SureCart\Integrations\Survey;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provides the Survey service provider.
 */
class SurveyServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.survey.notice'] = function () {
			return new SurveyNotice();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.survey.notice']->bootstrap();
	}
}
