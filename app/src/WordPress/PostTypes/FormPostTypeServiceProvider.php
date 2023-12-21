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
		$container['surecart.forms']                              = function ( $container ) {
			return new FormPostTypeService( $container['surecart.pages'] );
		};
		$container['surecart.cart.post']                          = function( $container ) {
			return new CartPostTypeService( $container['surecart.pages'] );
		};
		$container['surecart.post_types.product']                 = function() {
			return new ProductPostTypeService();
		};
		$container['surecart.post_types.price']                   = function() {
			return new PricePostTypeService();
		};
		$container['surecart.post_types.variant']                 = function() {
			return new VariantPostTypeService();
		};
		$container['surecart.post_types.variant_option']          = function() {
			return new VariantOptionPostTypeService();
		};
		$container['surecart.post_types.product_collection_page'] = function() {
			return new ProductCollectionsPagePostTypeService();
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
		$container['surecart.post_types.product']->bootstrap();
		$container['surecart.post_types.price']->bootstrap();
		$container['surecart.post_types.variant']->bootstrap();
		$container['surecart.post_types.variant_option']->bootstrap();
		$container['surecart.post_types.product_collection_page']->bootstrap();
	}
}
