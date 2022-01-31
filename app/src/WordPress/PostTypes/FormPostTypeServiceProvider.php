<?php

namespace CheckoutEngine\WordPress\PostTypes;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register our form post type
 */
class FormPostTypeServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$container['checkout_engine.forms'] = function ( $container ) {
			return new FormPostTypeService( $container['checkout_engine.pages'] );
		};

		$app = $container[ CHECKOUT_ENGINE_APPLICATION_KEY ];
		$app->alias( 'forms', 'checkout_engine.forms' );
	}

	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['checkout_engine.forms']->bootstrap();
	}
}
