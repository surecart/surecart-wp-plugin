<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;
use SureCart\Models\Review;

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
		if ( empty( $product ) ) {
			return;
		}

		// Reviews are not enabled - don't render.
		if ( ! apply_filters( 'surecart/review_form/enabled', $product->reviews_enabled ) ) {
			return;
		}

		// Check if there are any published reviews for this product.
		$reviews = Review::where(
			[
				'status[]'      => 'published',
				'product_ids[]' => [ $product->id ],
				'limit'         => 1, // We only need to know if at least one exists.
			]
		)->get();

		// No reviews - don't render the content.
		if ( empty( $reviews ) || is_wp_error( $reviews ) ) {
			return;
		}

		$output  = "<div {$this->render_attributes( '_root' )}>";
		$output .= \Bricks\Frontend::render_children( $this );
		$output .= '</div>';

		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
