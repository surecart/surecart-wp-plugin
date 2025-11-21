<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Review Breakdown element.
 */
class ProductReviewBreakdown extends \Bricks\Element {
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
	 * Set control groups.
	 *
	 * @return void
	 */
	public function set_control_groups() {
		$this->control_groups['column_spacing'] = [
			'title' => esc_html__( 'Column & Spacing', 'surecart' ),
			'tab'   => 'content',
		];

		$this->control_groups['star_bar_colors'] = [
			'title' => esc_html__( 'Star & Bar Colors', 'surecart' ),
			'tab'   => 'content',
		];
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['show_for_zero_reviews'] = [
			'tab'     => 'content',
			'label'   => esc_html__( 'Show for Zero Reviews', 'surecart' ),
			'type'    => 'checkbox',
			'default' => false,
		];

		$this->controls['star_size'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Star Size', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'default'     => '20px',
			'placeholder' => '20px',
		];

		$this->controls['star_label_gap'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Star Label Gap', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'default'     => '4px',
			'placeholder' => '4px',
			'description' => esc_html__( 'Adjust the spacing between the star number and star icon.', 'surecart' ),
			'css'         => [
				[
					'property' => 'gap',
					'selector' => '.sc-star-row__label',
				],
			],
		];

		$this->controls['columns'] = [
			'tab'         => 'content',
			'group'       => 'column_spacing',
			'label'       => esc_html__( 'Columns', 'surecart' ),
			'type'        => 'select',
			'options'     => [
				'1' => esc_html__( '1 Column', 'surecart' ),
				'2' => esc_html__( '2 Columns', 'surecart' ),
				'3' => esc_html__( '3 Columns', 'surecart' ),
			],
			'default'     => '1',
			'placeholder' => esc_html__( '1 Column', 'surecart' ),
			'description' => esc_html__( 'Choose the number of columns to display the review breakdown . ', 'surecart' ),
		];

		$this->controls['row_gap'] = [
			'tab'         => 'content',
			'group'       => 'column_spacing',
			'label'       => esc_html__( 'Row Gap', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'default'     => '2px',
			'placeholder' => '2px',
			'description' => esc_html__( 'Adjust the spacing between rows . ', 'surecart' ),
			'css'         => [
				[
					'property' => 'row-gap',
					'selector' => '.sc-star-bars',
				],
			],
		];

		$this->controls['column_gap'] = [
			'tab'         => 'content',
			'group'       => 'column_spacing',
			'label'       => esc_html__( 'Column Gap', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'default'     => '20px',
			'placeholder' => '20px',
			'description' => esc_html__( 'Adjust the spacing between columns . ', 'surecart' ),
			'css'         => [
				[
					'property' => 'column-gap',
					'selector' => '.sc-star-bars',
				],
			],
			'required'    => [ 'columns', '!=', '1' ],
		];

		$this->controls['fill_color'] = [
			'group'    => 'star_bar_colors',
			'label'    => esc_html__( 'Star Color', 'surecart' ),
			'type'     => 'color',
			'rerender' => true,
			'default'  => [
				'hex' => 'var(--bricks-color-primary)',
			],
			'css'      => [
				[
					'property' => 'color',
					'selector' => '.sc-star-row__label svg',
				],
				[
					'property' => 'fill',
					'selector' => '.sc-star-row__label svg',
				],
				[
					'property' => 'stroke',
					'selector' => '.sc-star-row__label svg',
				],
			],
		];

		$this->controls['bar_fill_color'] = [
			'group'   => 'star_bar_colors',
			'label'   => esc_html__( 'Bar Active Color', 'surecart' ),
			'type'    => 'color',
			'default' => [
				'hex' => 'var(--bricks-color-primary)',
			],
			'css'     => [
				[
					'property' => 'background-color',
					'selector' => '.sc-star-bars .sc-star-row__bar .sc-star-row__bar-fill',
				],
			],
		];

		$this->controls['bar_background_color'] = [
			'group'   => 'star_bar_colors',
			'label'   => esc_html__( 'Bar Background Color', 'surecart' ),
			'type'    => 'color',
			'default' => [
				'hex' => '#e0e0e0',
			],
			'css'     => [
				[
					'property' => 'background-color',
					'selector' => '.sc-star-bars .sc-star-row__bar',
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
		$star_size             = ! empty( $this->settings['star_size'] ) ? (int) $this->settings['star_size'] : 20;
		$star_label_gap        = ! empty( $this->settings['star_label_gap'] ) ? (int) $this->settings['star_label_gap'] : 4;
		$columns               = ! empty( $this->settings['columns'] ) ? (int) $this->settings['columns'] : 1;
		$row_gap               = ! empty( $this->settings['row_gap'] ) ? (int) $this->settings['row_gap'] : 2;
		$column_gap            = ! empty( $this->settings['column_gap'] ) ? (int) $this->settings['column_gap'] : 20;
		$fill_color            = $this->get_raw_color( 'fill_color' );
		if ( empty( $fill_color ) ) {
			$fill_color = 'var(--bricks-color-primary)';
		}

		if ( $this->is_admin_editor() ) {
			$this->render_preview( $star_size, $fill_color, $columns, $column_gap );
			return;
		}

		$attributes = [
			'show_for_zero_reviews' => $show_for_zero_reviews,
			'size'                  => $star_size,
			'star_label_gap'        => $star_label_gap,
			'columns'               => $columns,
			'row_gap'               => $row_gap,
			'column_gap'            => $column_gap,
			'fill_color'            => esc_attr( $fill_color ),
		];

		$content = $this->html( $attributes );

		echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			'<!-- wp:surecart/product-review-summary -->' . $content . '<!-- /wp:surecart/product-review-summary -->' // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);
	}

	/**
	 * Render preview in editor.
	 *
	 * @param int    $star_size Star size.
	 * @param string $fill_color Fill color.
	 * @param int    $columns Number of columns.
	 * @param int    $column_gap Column gap in pixels.
	 *
	 * @return void
	 */
	private function render_preview( $star_size = 20, $fill_color, $columns = 1, $column_gap = 20 ) {
		$breakdown_data = [
			5 => 45,
			4 => 25,
			3 => 10,
			2 => 5,
			1 => 3,
		];
		$total          = array_sum( $breakdown_data );

		// Calculate max height for multi-column layouts.
		$max_height = '';
		if ( 2 === $columns ) {
			$max_height = 'max-height: 150px;';
		} elseif ( 3 === $columns ) {
			$max_height = 'max-height: 85px;';
		}

		$content = '<div class="sc-star-bars sc-star-bars__columns-' . esc_attr( $columns ) . '" style="display: flex; flex-direction: column; flex-wrap: wrap; align-content: flex-start; ' . $max_height . '">';
		for ( $star = 5; $star >= 1; $star-- ) {
			$count      = $breakdown_data[ $star ];
			$percentage = $total > 0 ? ( $count / $total ) * 100 : 0;

			// Calculate width for multi-column layouts.
			$width_style = '';
			if ( 2 === $columns ) {
				$width_style = 'width: calc(50% - ' . esc_attr( $column_gap / 2 ) . 'px);';
			} elseif ( 3 === $columns ) {
				$width_style = 'width: calc(33.333% - ' . esc_attr( $column_gap * 2 / 3 ) . 'px);';
			}

			$content .= '<a href="#" class="sc-star-row" onclick="event.preventDefault();" style="display: flex; width: 100%; align-items: center; gap: 8px; text-decoration: none; color: inherit; cursor: pointer; transition: opacity 0.2s ease; ' . $width_style . '">';
			$content .= '<div class="sc-star-row__label" style="display: flex; align-items: center; justify-content: center;">';
			$content .= esc_html( $star );
			$content .= wp_kses(
				\SureCart::svg()->get(
					'star',
					[
						'height'       => esc_attr( $star_size ),
						'width'        => esc_attr( $star_size ),
						'fill'         => esc_attr( $fill_color ),
						'stroke'       => esc_attr( $fill_color ),
						'stroke-width' => 2,
					]
				),
				sc_allowed_svg_html()
			);
			$content .= '</div>';
			$content .= '<div class="sc-star-row__bar" style="flex: 1; height: 8px; border-radius: 4px; overflow: hidden; position: relative; min-width: 100px;">';
			$content .= '<div class="sc-star-row__bar-fill" style="height: 100%; border-radius: 4px; width: ' . esc_attr( $percentage ) . '%; transition: width 0.3s ease;"></div>';
			$content .= '</div>';
			$content .= '<div class="sc-star-row__count" style="text-align: right;">' . esc_html( $count ) . '</div>';
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
