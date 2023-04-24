<?php

namespace SureCart\WordPress\Templates;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Templates service provider.
 */
class TemplatesServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.templates.page'] = function( $c ) {
			return new TemplatesService(
				$c,
				[
					'pages/template-surecart-blank.php' => esc_html__( 'SureCart', 'surecart' ),
					'pages/template-surecart-dashboard.php' => esc_html__( 'SureCart Customer Dashboard', 'surecart' ),
				],
				'page'
			);
		};

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'templates', 'surecart.templates' );
	}

	/**
	 * Bootstrap the service.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.templates.page']->bootstrap();
	}
}
