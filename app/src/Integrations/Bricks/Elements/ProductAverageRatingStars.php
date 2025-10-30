<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Average Rating Stars element.
 */
class ProductAverageRatingStars extends \Bricks\Element {
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
			'label'       => esc_html__( 'Size', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'default'     => '25px',
			'placeholder' => '25px',
		];

		$this->controls['fill_color'] = [
			'tab'     => 'content',
			'label'   => esc_html__( 'Fill Color', 'surecart' ),
			'type'    => 'color',
			'default' => [
				'hex' => 'var(--bricks-color-primary)',
			],
			'css'     => [
				[
					'property' => 'color',
					'selector' => '.wp-block-surecart-product-review-average-rating-stars svg',
				],
				[
					'property' => 'fill',
					'selector' => '.wp-block-surecart-product-review-average-rating-stars svg',
				],
				[
					'property' => 'stroke',
					'selector' => '.wp-block-surecart-product-review-average-rating-stars svg',
				],
			],
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$size       = ! empty( $this->settings['size'] ) ? $this->settings['size'] : '25px';
		$fill_color = $this->get_raw_color( 'fill_color' );

		if ( $this->is_admin_editor() ) {
			$this->render_preview( $size );
			return;
		}

		$product = sc_get_product();
		if ( empty( $product ) || empty( $product->total_reviews ) ) {
			$fill_color = 'none';
		}

		echo $this->html( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			[
				'size'       => (int) $size,
				'fill_color' => esc_attr( $fill_color ),
			]
		);
	}

	/**
	 * Render preview in editor.
	 *
	 * @param string $size Star size.
	 *
	 * @return void
	 */
	private function render_preview( $size ) {
		$stars_html = '';
		for ( $i = 1; $i <= 5; $i++ ) {
			$is_half = 5 === $i;
			$fill    = $this->get_raw_color( 'fill_color' );

			if ( $is_half ) {
				$stars_html .= \SureCart::svg()->get(
					'half-star',
					[
						'height' => esc_attr( $size ),
						'width'  => esc_attr( $size ),
						'stroke' => esc_attr( $fill ),
						'color'  => esc_attr( $fill ),
					]
				);
			} else {
				$stars_html .= \SureCart::svg()->get(
					'star',
					[
						'height' => esc_attr( $size ),
						'width'  => esc_attr( $size ),
						'fill'   => esc_attr( $fill ),
						'stroke' => esc_attr( $fill ),
					]
				);
			}
		}

		echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$stars_html,
			'wp-block-surecart-product-review-average-rating-stars',
			'div'
		);
	}
}
