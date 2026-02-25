<?php

namespace SureCart\Integrations\NpsSurvey;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provides the NPS Survey service provider.
 */
class NpsSurveyServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.nps.survey'] = function () {
			return new NpsSurveyService();
		};

		$container['surecart.nps.survey.notice'] = function () {
			return new NpsSurveyNotice();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.nps.survey']->bootstrap();
		$container['surecart.nps.survey.notice']->bootstrap();
	}
}
