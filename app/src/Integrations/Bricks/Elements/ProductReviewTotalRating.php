<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Total Rating element.
 */
class ProductReviewTotalRating extends \Bricks\Element {
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
	public $name = 'surecart-product-review-total-rating';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-review-total-rating';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-write';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Total Rating', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['show_for_zero_reviews'] = [
			'tab'     => 'content',
			'label'   => esc_html__( 'Show For Zero Reviews', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];

		$this->controls['show_label'] = [
			'tab'     => 'content',
			'label'   => esc_html__( 'Show Label', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];

		$this->controls['style_variant'] = [
			'tab'     => 'content',
			'label'   => esc_html__( 'Style', 'surecart' ),
			'type'    => 'select',
			'options' => [
				'default'   => esc_html__( 'Default', 'surecart' ),
				'plus-sign' => esc_html__( 'Plus Sign', 'surecart' ),
			],
			'default' => 'plus-sign',
			'inline'  => true,
		];

		$this->controls['link_to_reviews'] = [
			'tab'     => 'content',
			'label'   => esc_html__( 'Link to Reviews', 'surecart' ),
			'type'    => 'checkbox',
			'default' => false,
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$show_label            = ! empty( $this->settings['show_label'] );
		$show_for_zero_reviews = ! empty( $this->settings['show_for_zero_reviews'] );
		$style_variant         = ! empty( $this->settings['style_variant'] ) ? $this->settings['style_variant'] : 'default';
		$link_to_reviews       = ! empty( $this->settings['link_to_reviews'] );

		if ( $this->is_admin_editor() ) {
			$this->render_preview( $show_label, $style_variant );
			return;
		}

		// Determine class name based on style variant.
		$class_name = 'default' !== $style_variant ? 'is-style-' . $style_variant : '';

		$attributes = [
			'show_label'            => $show_label,
			'show_for_zero_reviews' => $show_for_zero_reviews,
			'link_to_reviews'       => $link_to_reviews,
			'className'             => $class_name,
		];

		echo $this->html( $attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Render preview in editor.
	 *
	 * @param bool   $show_label    Show label flag.
	 * @param string $style_variant Style variant.
	 *
	 * @return void
	 */
	private function render_preview( $show_label, $style_variant ) {
		$plus_sign = 'plus-sign' === $style_variant ? '+' : '';
		$content   = '<span class="sc-total-reviews-count">42' . $plus_sign . '</span>';

		if ( $show_label ) {
			$content .= ' ' . esc_html__( 'reviews', 'surecart' );
		}

		echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$content,
			'wp-block-surecart-product-review-total-rating',
			'div'
		);
	}
}
