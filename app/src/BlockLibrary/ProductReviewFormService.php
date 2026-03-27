<?php

namespace SureCart\BlockLibrary;

/**
 * The product review form service.
 */
class ProductReviewFormService {
	/**
	 * Flag to track if template has been rendered.
	 *
	 * @var bool
	 */
	private static $rendered = false;

	/**
	 * Include review form template.
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
		$review_form_template = $this->getTemplate();

		// add review form template to footer.
		add_action(
			'wp_footer',
			function () use ( $review_form_template ) {
				echo $review_form_template; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
		);

		// Mark template as rendered.
		self::$rendered = true;
	}

	/**
	 * Get the review form template.
	 *
	 * @return string
	 */
	public function getTemplate() {
		// get review form block.
		$template = get_block_template( 'surecart/surecart//product-review-form', 'wp_template_part' );
		if ( ! $template || empty( $template->content ) ) {
			return '';
		}

		// WordPress 6.9+ dequeues styles for blocks when their parent returns empty content.
		// Since the review form is rendered in wp_footer (outside normal block flow),
		// we need to force WordPress to keep the block assets enqueued.
		// @see https://core.trac.wordpress.org/ticket/63676.
		add_filter( 'enqueue_empty_block_content_assets', '__return_true' );

		ob_start();

		// Render the product review form modal.
		echo do_blocks( $template->content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

		return trim( preg_replace( '/\s+/', ' ', ob_get_clean() ) );
	}
}
