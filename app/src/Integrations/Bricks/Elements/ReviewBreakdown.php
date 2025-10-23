<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Review Breakdown element.
 */
class ReviewBreakdown extends \Bricks\Element {
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
	public $name = 'surecart-product-review-breakdown';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-review-breakdown';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-bar-chart';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Review Breakdown', 'surecart' );
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

		$this->controls['star_size'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Star Size', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'default'     => '25px',
			'placeholder' => '25px',
		];

		$this->controls['star_color'] = [
			'tab'     => 'style',
			'label'   => esc_html__( 'Star Color', 'surecart' ),
			'type'    => 'color',
			'default' => [
				'hex' => 'var(--bricks-color-primary)',
			],
			'css'     => [
				[
					'property' => 'fill',
					'selector' => '.sc-star-label svg',
				],
				[
					'property' => 'stroke',
					'selector' => '.sc-star-label svg',
				],
				[
					'property' => 'color',
					'selector' => '.sc-star-label svg',
				],
			],
		];

		$this->controls['bar_color'] = [
			'tab'     => 'style',
			'label'   => esc_html__( 'Bar Fill Color', 'surecart' ),
			'type'    => 'color',
			'default' => [
				'hex' => 'var(--bricks-color-primary)',
			],
			'css'     => [
				[
					'property' => 'background-color',
					'selector' => '.sc-bar-fill',
				],
			],
		];

		$this->controls['bar_background_color'] = [
			'tab'     => 'style',
			'label'   => esc_html__( 'Bar Background Color', 'surecart' ),
			'type'    => 'color',
			'default' => [
				'hex' => '#e0e0e0',
			],
			'css'     => [
				[
					'property' => 'background-color',
					'selector' => '.sc-bar-wrap',
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
		$show_for_zero_reviews = ! empty( $this->settings['show_for_zero_reviews'] );
		$star_size             = ! empty( $this->settings['star_size'] ) ? (int) $this->settings['star_size'] : 25;

		if ( $this->is_admin_editor() ) {
			$this->render_preview( $star_size );
			return;
		}

		echo $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			'<!-- wp:surecart/product-review-summary -->' .
			$this->html(
				[
					'show_for_zero_reviews' => $show_for_zero_reviews,
					'size'                  => $star_size,
				]
			) .
			'<!-- /wp:surecart/product-review-summary -->'
		);
	}

	/**
	 * Render preview in editor.
	 *
	 * @param int $star_size Star size.
	 *
	 * @return void
	 */
	private function render_preview( $star_size ) {
		$breakdown_data = [
			5 => 45,
			4 => 25,
			3 => 10,
			2 => 5,
			1 => 3,
		];
		$total          = array_sum( $breakdown_data );

		$content = '<div class="sc-star-bars">';
		for ( $star = 5; $star >= 1; $star-- ) {
			$count      = $breakdown_data[ $star ];
			$percentage = $total > 0 ? ( $count / $total ) * 100 : 0;

			$content .= '<a href="#" class="sc-star-row" onclick="event.preventDefault();" style="display: flex; align-items: center; gap: 12px; padding: 8px; text-decoration: none; color: inherit;">';
			$content .= '<div class="sc-star-label" style="display: flex; align-items: center; gap: 4px; min-width: 50px;">';
			$content .= esc_html( $star );
			$content .= '<svg height="' . esc_attr( $star_size ) . '" width="' . esc_attr( $star_size ) . '" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">';
			$content .= '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
			$content .= '</svg>';
			$content .= '</div>';
			$content .= '<div class="sc-bar-wrap" style="flex: 1; height: 12px; background-color: #e0e0e0; border-radius: 4px; overflow: hidden;">';
			$content .= '<div class="sc-bar-fill" style="height: 100%; background-color: var(--bricks-color-primary); border-radius: 4px; width: ' . esc_attr( $percentage ) . '%;"></div>';
			$content .= '</div>';
			$content .= '<div class="sc-count" style="min-width: 30px; text-align: right;">' . esc_html( $count ) . '</div>';
			$content .= '</a>';
		}
		$content .= '</div>';

		echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$content,
			'wp-block-surecart-product-review-breakdown',
			'div'
		);
	}
}
