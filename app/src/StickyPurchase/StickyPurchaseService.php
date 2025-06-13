<?php

namespace SureCart\StickyPurchase;

/**
 * Provides the sticky purchase service.
 */
class StickyPurchaseService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'template_include', [ $this, 'includeStickyPurchaseTemplate' ] );
	}

	/**
	 * Include sticky purchase template.
	 * This needs to run before <head> so that blocks can add scripts and styles in wp_head().
	 *
	 * @param string $template The template path.
	 * @return string
	 */
	public function includeStickyPurchaseTemplate( $template ) {
		$sticky_purchase = $this->stickyPurchaseTemplate();

		// If no template is found, return the original template.
		if ( ! $sticky_purchase ) {
			return $template;
		}

		// add sticky purchase template to the footer.
		add_action(
			'wp_footer',
			function () use ( $sticky_purchase ) {
				echo $sticky_purchase; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
		);

		return $template;
	}

	/**
	 * Get the cart template.
	 *
	 * @return string
	 */
	public function stickyPurchaseTemplate() {
		// Check if sticky purchase button is enabled in cart template.
		if ( ! $this->isStickyPurchaseEnabled() ) {
			return;
		}

		$template = get_block_template( 'surecart/surecart//sticky-purchase', 'wp_template_part' );
		if ( ! $template || empty( $template->content ) ) {
			return;
		}

		ob_start();

		// Render the sticky purchase.
		echo do_blocks( $template->content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

		return trim( preg_replace( '/\s+/', ' ', ob_get_clean() ) );
	}

	/**
	 * Check if sticky purchase button is enabled in cart template.
	 *
	 * @return bool
	 */
	private function isStickyPurchaseEnabled() {
		$cart_template = get_block_template( 'surecart/surecart//cart', 'wp_template_part' );

		if ( ! $cart_template || empty( $cart_template->content ) ) {
			return false;
		}

		// Parse blocks to find surecart/slide-out-cart-submit block.
		$blocks = parse_blocks( $cart_template->content );

		return $this->findStickyPurchaseSetting( $blocks );
	}

	/**
	 * Recursively search for show_sticky_purchase_button setting in blocks.
	 *
	 * @param array $blocks Array of blocks to search.
	 * @return bool
	 */
	private function findStickyPurchaseSetting( $blocks ) {
		foreach ( $blocks as $block ) {
			// Check if this is the slide-out-cart-submit block.
			if ( 'surecart/slide-out-cart-submit' === $block['blockName'] ) {
				$attrs = $block['attrs'] ?? [];
				return isset( $attrs['show_sticky_purchase_button'] ) && $attrs['show_sticky_purchase_button'] === true;
			}

			// Recursively check inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$result = $this->findStickyPurchaseSetting( $block['innerBlocks'] );
				if ( $result ) {
					return true;
				}
			}
		}

		return false;
	}
}
