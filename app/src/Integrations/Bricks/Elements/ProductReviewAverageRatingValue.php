<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Average Rating Value element.
 */
class ProductReviewAverageRatingValue extends \Bricks\Element {
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
	public $name = 'surecart-product-review-average-rating-value';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-review-average-rating-value';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-bookmark-alt';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Average Rating Value', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['format_style'] = [
			'tab'     => 'content',
			'label'   => esc_html__( 'Format Style', 'surecart' ),
			'type'    => 'select',
			'options' => [
				'none'        => esc_html__( 'None', 'surecart' ),
				'parentheses' => esc_html__( 'Parentheses', 'surecart' ),
				'slash'       => esc_html__( '/ 5.0', 'surecart' ),
			],
			'default' => 'none',
			'inline'  => true,
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$format_style = ! empty( $this->settings['format_style'] ) ? $this->settings['format_style'] : 'none';
		$class_name   = 'none' === $format_style ? '' : 'is-style-' . $format_style;

		if ( $this->is_admin_editor() ) {
			$display_value = '4.3';
			if ( 'parentheses' === $format_style ) {
				$display_value = '(4.3)';
			} elseif ( 'slash' === $format_style ) {
				$display_value = '4.3 / 5.0';
			}

			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				esc_html( $display_value ),
				'wp-block-surecart-product-review-average-rating-value ' . esc_attr( $class_name ),
				'span'
			);
			return;
		}

		echo $this->html( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			[
				'className' => esc_attr( $class_name ),
			]
		);
	}
}
