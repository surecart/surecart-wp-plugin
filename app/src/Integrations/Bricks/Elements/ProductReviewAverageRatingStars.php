<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Average Rating Stars element.
 */
class ProductReviewAverageRatingStars extends \Bricks\Element {
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
	public $name = 'surecart-product-review-average-rating-stars';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-review-average-rating-stars';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-star';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Average Rating Stars', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['size'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Star Size', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'default'     => '20px',
			'placeholder' => '20px',
		];

		$this->controls['fill_color'] = [
			'tab'      => 'content',
			'label'    => esc_html__( 'Star Color', 'surecart' ),
			'type'     => 'color',
			'rerender' => true,
			'default'  => [
				'hex' => 'var(--bricks-color-primary)',
			],
			'css'      => [
				[
					'property' => 'color',
					'selector' => 'svg',
				],
				[
					'property' => 'stroke',
					'selector' => 'svg',
				],
			],
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
		$size            = ! empty( $this->settings['size'] ) ? $this->settings['size'] : '20px';
		$fill_color      = $this->get_raw_color( 'fill_color' );
		$link_to_reviews = ! empty( $this->settings['link_to_reviews'] );

		if ( empty( $fill_color ) ) {
			$fill_color = 'var(--bricks-color-primary)';
		}

		$this->set_attribute( '_root', 'style', 'display: flex;' );

		if ( $this->is_admin_editor() ) {
			$this->render_preview( $size, $fill_color );
			return;
		}

		// Ensure size has px unit, similar to Elementor implementation.
		$size_value = is_numeric( $size ) ? absint( $size ) . 'px' : $size;

		echo $this->html( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			[
				'size'            => $size_value,
				'fill_color'      => esc_attr( $fill_color ),
				'link_to_reviews' => $link_to_reviews, //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			]
		);
	}

	/**
	 * Render preview in editor.
	 *
	 * @param string $size       Star size.
	 * @param string $fill_color Star fill color.
	 *
	 * @return void
	 */
	private function render_preview( $size, $fill_color ) {
		$stars_html = '';
		for ( $i = 1; $i <= 5; $i++ ) {
			$is_full_star = $i <= 4;
			$is_half_star = 5 === $i;

			$stars_html .= \SureCart::svg()->get(
				$is_half_star ? 'half-star' : 'star',
				[
					'class'        => 'sc-star-row__label__svg',
					'height'       => esc_attr( $size ),
					'width'        => esc_attr( $size ),
					'fill'         => $is_full_star || $is_half_star ? 'currentColor' : 'none',
					'stroke'       => 'currentColor',
					'stroke-width' => 2,
					'aria-hidden'  => 'true',
				]
			);
		}

		echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$stars_html,
			'wp-block-surecart-product-review-average-rating-stars',
			'div'
		);
	}
}
