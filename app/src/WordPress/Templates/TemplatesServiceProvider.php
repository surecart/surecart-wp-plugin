<?php

namespace SureCart\WordPress\Templates;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register translations.
 */
class TemplatesServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.templates'] = function( $c ) {
			return new TemplatesService(
				$c,
				[
					'template-surecart-no-sidebar.php' => esc_html__( 'SureCart: Full Width No Sidebar', 'surecart' ),
				],
				$c['surecart.product.post']->getPostType()
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
		$container['surecart.templates']->bootstrap();
	}
}
