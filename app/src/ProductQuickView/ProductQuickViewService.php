<?php

namespace SureCart\ProductQuickView;

/**
 * The quick view service.
 */
class ProductQuickViewService {
	/**
	 * Bootstrap the cart.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'template_include', [ $this, 'includeQuickViewTemplate' ] );
	}

	/**
	 * Include quick view template.
	 * This needs to run before <head> so that blocks can add scripts and styles in wp_head().
	 *
	 * @param string $template The template path.
	 * @return string
	 */
	public function includeQuickViewTemplate( $template ) {
		$quick_view_template = $this->productQuickViewTemplate();

		// add cart template to footer.
		add_action(
			'wp_footer',
			function () use ( $quick_view_template ) {
				echo $quick_view_template; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
		);

		return $template;
	}

	/**
	 * Get the cart template.
	 *
	 * @return string
	 */
	public function productQuickViewTemplate() {
		// get cart block.
		$template = get_block_template( 'surecart/surecart//product-quick-view', 'wp_template_part' );
		if ( ! $template || empty( $template->content ) ) {
			return;
		}

		ob_start();

		// Render the product quick view.
		echo do_blocks( $template->content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 

		return trim( preg_replace( '/\s+/', ' ', ob_get_clean() ) );
	}
}
