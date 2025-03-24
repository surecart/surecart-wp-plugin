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
		add_action( 'wp_footer', [ $this, 'renderProductQuickViewComponent' ] );
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

		echo "<!-- Render the Product quick view -->\n";
		// Render the product quick view.
		echo do_blocks( $template->content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 

		return trim( preg_replace( '/\s+/', ' ', ob_get_clean() ) );
	}

	/**
	 * Render the product quick view components.
	 *
	 * @return void
	 */
	public function renderProductQuickViewComponent() {
		echo $this->productQuickViewTemplate(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
