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
		if ( empty( $template ) || ! $this->isProductPage() ) {
			return $template;
		}

		add_action( 'wp_enqueue_scripts', [ $this, 'loadElementorAssetsForProductTemplate' ], 9 );
		return $template;
	}

	/**
	 * Determine if the current page is a surecart product page.
	 *
	 * @return bool True if this page contains product elements.
	 */
	private function isProductPage(): bool {
		global $post;
		if ( ! $post ) {
			return false;
		}

		// Check if the current post is a product post type or if the query variable indicates a product.
		return get_query_var( 'surecart_current_product' ) || 'sc_product' === $post->post_type;
	}

	/**
	 * Force load Elementor scripts for SureCart product templates.
	 *
	 * @return void
	 */
	public function loadElementorAssetsForProductTemplate(): void {
		$template_id = $this->get_surecart_elementor_template_id();
		if ( ! $template_id ) {
			return;
		}

		$document = \Elementor\Plugin::$instance->documents->get( $template_id );
		if ( ! $document || ! $document->is_built_with_elementor() ) {
			return;
		}

		$elementor_frontend = \Elementor\Plugin::instance()->frontend;
		$elementor_frontend->enqueue_scripts();
		$elementor_frontend->get_builder_content_for_display( $template_id );
	}

	/**
	 * Get the SureCart Elementor template ID.
	 *
	 * @return int|null The ID of the SureCart Elementor template or null if not found.
	 */
	private function get_surecart_elementor_template_id() {
		$query = new \WP_Query(
			[
				'post_type'      => 'elementor_library',
				'meta_query'     => [
					[
						'key'   => '_elementor_template_type',
						'value' => 'surecart-product',
					],
				],
				'posts_per_page' => 1,
			]
		);

		return $query->have_posts() ? $query->posts[0]->ID : null;
	}
}
