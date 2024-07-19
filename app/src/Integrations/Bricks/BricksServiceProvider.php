<?php

namespace SureCart\Integrations\Bricks;

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
		if ( ! is_singular( 'sc_product' ) ) {
			return $content;
		}

		// check if the product page wrapper is not already added.
		if ( false === strpos( $content, '<form class="wp-block-surecart-product-page"' ) ) {
			$content = '<!-- wp:surecart/product-page -->' . $content . '<!-- /wp:surecart/product-page -->';
		}

		// check if the custom amount block is not already added.
		if ( false === strpos( $content, 'class="wp-block-surecart-product-selected-price-ad-hoc-amount"' ) ) {
			$content = str_replace(
				'<div class="wp-block-button wp-block-surecart-product-buy-button"',
				'<!-- wp:surecart/product-selected-price-ad-hoc-amount /-->' . PHP_EOL . '<div class="wp-block-button wp-block-surecart-product-buy-button"',
				$content
			);
		}

		return do_blocks( $content );
	}
}
