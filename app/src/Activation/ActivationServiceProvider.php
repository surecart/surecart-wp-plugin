<?php

namespace SureCart\Activation;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide users dependencies.
 */
class ActivationServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.activation'] = function ( $container ) {
			return new ActivationService( $container['surecart.permissions.roles'], $container['surecart.pages.seeder'], $container['surecart.permissions.salts'] );
		};

		$container['surecart.deactivation.survey'] = function ( $container ) {
			return new DeactivationSurveyService();
		};

		$container['surecart.deactivation.survey.form'] = function ( $container ) {
			return new DeactivationSurveyForm();
		};

		// register alias.
		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'activation', 'surecart.activation' );
		$app->alias( 'deactivationForm', 'surecart.deactivation.survey.form' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.activation']->bootstrap();
		$container['surecart.deactivation.survey.form']->bootstrap();
		$container['surecart.deactivation.survey']->bootstrap();
	}
}
