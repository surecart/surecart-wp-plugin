<?php

namespace SureCart\Integrations\Bricks;

use SureCart\Migration\ProductPageWrapperService;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the Bricks Service.
 */
class BricksServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		if ( ! wp_is_block_theme() ) {
			add_filter( 'bricks/frontend/render_data', [ $this, 'handleProductPageWrapper' ], 10, 2 );
		}
	}

	/**
	 * Handle the product page wrapper
	 *
	 * @param string $content Content of Shortcode.
	 *
	 * @return string $content Content of the product page.
	 */
	public function handleProductPageWrapper( string $content ): string {
		return (new ProductPageWrapperService( $content ))->wrap();
	}
}
