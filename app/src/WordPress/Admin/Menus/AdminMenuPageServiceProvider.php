<?php

namespace SureCart\WordPress\Admin\Menus;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register plugin options.
 */
class AdminMenuPageServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$app = $container[ SURECART_APPLICATION_KEY ];

		$container['surecart.admin.menus']                    = fn() => new AdminMenuPageService();
		$container['surecart.admin.toolbar']                  = fn() => new AdminToolbarService( $app );
		$container['surecart.product_collection_pages.menus'] = fn() => new ProductCollectionsMenuService();

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'adminToolbar', 'surecart.admin.toolbar' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.admin.menus']->bootstrap();
		$container['surecart.admin.toolbar']->bootstrap();
		$container['surecart.product_collection_pages.menus']->bootstrap();
	}
}
