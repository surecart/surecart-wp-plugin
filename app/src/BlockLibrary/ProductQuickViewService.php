<?php

namespace SureCart\BlockLibrary;

/**
 * The quick view service.
 */
class ProductQuickViewService {
	/**
	 * Flag to track if template has been rendered.
	 *
	 * @var bool
	 */
	private static $rendered = false;

	/**
	 * Include quick view template.
	 * This needs to run before <head> so that blocks can add scripts and styles in wp_head().
	 *
	 * @return void
	 */
	public function render() {
		// Only render the template once per page load.
		if ( self::$rendered ) {
			return;
		}

		// do this before the footer so we can print late styles.
		$quick_view_template = $this->getTemplate();

		// add cart template to footer.
		add_action(
			'wp_footer',
			function () use ( $quick_view_template ) {
				echo $quick_view_template; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
		);

		// Mark template as rendered.
		self::$rendered = true;
	}

	/**
	 * Get the cart template.
	 *
	 * @return string
	 */
	public function getTemplate() {
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
