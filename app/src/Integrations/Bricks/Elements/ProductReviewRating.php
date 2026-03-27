<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Review Rating element.
 */
class ProductReviewRating extends \Bricks\Element {
	use ConvertsBlocks;

	/**
	 * Element category.
	 *
	 * @var string
	 */
	public $category = 'SureCart Layout';

	/**
	 * Element name.
	 *
	 * @var string
	 */
	public $name = 'surecart-product-rating';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-rating';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-star';

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
		return esc_html__( 'Product Rating', 'surecart' );
	}

	/**
	 * Get nestable children.
	 *
	 * @return array
	 */
	public function get_nestable_children() {
		return array(
			array(
				'name'     => 'container',
				'label'    => esc_html__( 'Rating Container', 'surecart' ),
				'settings' => array(
					'_direction'      => 'row',
					'_alignItems'     => 'center',
					'_columnGap'      => '6px',
					'_justifyContent' => 'flex-start',
				),
				'children' => array(
					array(
						'name'     => 'surecart-product-review-average-rating-stars',
						'settings' => array(
							'_typography' => array(
								'line-height' => '1',
							),
						),
					),
					array(
						'name'     => 'surecart-product-review-average-rating-value',
						'settings' => array(
							'format_style' => 'parentheses',
						),
					),
					array(
						'name'     => 'surecart-product-review-total-rating',
						'settings' => array(
							'style_variant' => 'plus-sign',
							'show_label'    => true,
						),
					),
				),
			),
		);
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$output = "<div {$this->render_attributes( '_root' )}>";

		// Render children elements (= individual items).
		$output .= \Bricks\Frontend::render_children( $this );

		$output .= '</div>';

		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
