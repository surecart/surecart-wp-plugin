<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Review Content element.
 *
 * This is a conditional wrapper element that only renders its children
 * when reviews exist for the current product. Similar to the Gutenberg
 * `surecart/product-reviews` block.
 */
class ProductReviewContent extends \Bricks\Element {
	use ConvertsBlocks;

	/**
	 * Element category.
	 *
	 * @var string
	 */
	public $category = 'SureCart Elements';

	/**
	 * Element name.
	 *
	 * @var string
	 */
	public $name = 'surecart-product-review-content';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-reviews';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-layout-placeholder';

	/**
	 * This is nestable.
	 *
	 * @var bool
	 */
	public $nestable = true;

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Review Content', 'surecart' );
	}

	/**
	 * Get nestable children.
	 *
	 * @return array
	 */
	public function get_nestable_children() {
		// Default empty - users can add any content they want inside.
		return [];
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['info_notice'] = [
			'tab'     => 'content',
			'type'    => 'info',
			'content' => sprintf(
				'<strong>%s</strong><br><br>%s',
				esc_html__( 'Conditional Visibility Wrapper', 'surecart' ),
				esc_html__( 'This wrapper conditionally hides its contents when no reviews exist for the product. Place your review summary elements (Average Rating, Stars, Breakdown, etc.) inside this wrapper. Do not remove this element if you want conditional visibility.', 'surecart' )
			),
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		// In editor mode, always render children for preview.
		if ( $this->is_admin_editor() ) {
			$output  = "<div {$this->render_attributes( '_root' )}>";
			$output .= \Bricks\Frontend::render_children( $this );
			$output .= '</div>';
			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}

		// On frontend, check if reviews exist before rendering.
		$product = sc_get_product();

		// No product - don't render.
		if ( empty( $product ) || empty( $product->total_reviews ) ) {
			return;
		}

		// Reviews are not enabled - don't render.
		if ( ! apply_filters( 'surecart/review_form/enabled', $product->reviews_enabled ) ) {
			return;
		}

		$output  = "<div {$this->render_attributes( '_root' )}>";
		$output .= \Bricks\Frontend::render_children( $this );
		$output .= '</div>';

		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
