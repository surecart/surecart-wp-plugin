<?php

namespace SureCart\Integrations\Elementor;

/**
 * Class to handle FSE script loading for Elementor integration.
 */
class ElementorFseScriptLoaderService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		if ( ! \SureCart::utility()->blockTemplates()->isFSETheme() ) {
			return;
		}

		add_filter( 'template_include', [ $this, 'maybePreloadProductScripts' ], 999 );
	}

	/**
	 * Check if the current template might be a product page
	 *
	 * @param string $template The template being loaded.
	 * @return string The template path unchanged.
	 */
	public function maybePreloadProductScripts( $template ) {
		// Ensure the template is not empty.
		if ( empty( $template ) ) {
			return $template;
		}

		// Check if this is a product context.
		if ( ! $this->is_product_page() ) {
			return $template;
		}

		add_action( 'wp_enqueue_scripts', [ $this, 'preloadProductScripts' ], 5 );
		return $template;
	}

	/**
	 * Determine if the current page is a product page.
	 *
	 * @return bool True if this page contains product elements.
	 */
	private function is_product_page(): bool {
		global $post;
		if ( ! $post ) {
			return false;
		}

		// Check if the current post is a product post type or if the query variable indicates a product.
		return get_query_var( 'surecart_current_product' ) || 'sc_product' === $post->post_type;
	}

	/**
	 * Preload product scripts in head for FSE themes.
	 *
	 * @return void
	 */
	public function preloadProductScripts(): void {
		if ( ! function_exists( 'wp_enqueue_script_module' ) ) {
			return;
		}

		wp_enqueue_script_module( '@surecart/product-page' );
	}
}
