<?php

namespace SureCart\WordPress\PostTypes;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

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
		$container['surecart.forms']         = function ( $container ) {
			return new FormPostTypeService( $container['surecart.pages'] );
		};
		$container['surecart.cart.post']     = function( $container ) {
			return new CartPostTypeService( $container['surecart.pages'] );
		};
		$container['surecart.template.post'] = function( $container ) {
			return new TemplatePostTypeService( $container['surecart.pages'] );
		};

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'forms', 'surecart.forms' );
		$app->alias( 'cartPost', 'surecart.cart.post' );
	}

	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.forms']->bootstrap();
		$container['surecart.cart.post']->bootstrap();
		$container['surecart.template.post']->bootstrap();
	}
}
