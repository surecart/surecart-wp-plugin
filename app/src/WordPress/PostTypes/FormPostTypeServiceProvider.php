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
