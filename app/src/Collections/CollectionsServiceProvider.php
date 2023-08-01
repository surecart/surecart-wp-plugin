<?php
namespace SureCart\Collections;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

class CollectionsServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.collections.pages.wp.menu'] = function () {
			return new CollectionsPagesWordPressMenuService();
		};
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.collections.pages.wp.menu']->bootstrap();
	}
}
