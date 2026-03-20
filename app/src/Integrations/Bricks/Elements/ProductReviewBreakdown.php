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
			'description' => esc_html__( 'Choose the number of columns to display the review breakdown. Keep in mind the number of columns may shrink if the width is too narrow.', 'surecart' ),
		];

		$this->controls['star_size'] = [
			'tab'         => 'content',
			'group'       => 'column_spacing',
			'label'       => esc_html__( 'Star Size', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'min'         => 8,
			'max'         => 64,
			'default'     => '20px',
			'placeholder' => '20px',
		];

		$this->controls['row_gap'] = [
			'tab'         => 'content',
			'group'       => 'column_spacing',
			'label'       => esc_html__( 'Row Gap', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'min'         => 0,
			'max'         => 50,
			'default'     => '2px',
			'placeholder' => '2px',
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
			'min'         => 0,
			'max'         => 100,
			'default'     => '20px',
			'placeholder' => '20px',
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
		$star_size  = ! empty( $this->settings['star_size'] ) ? $this->settings['star_size'] : '20px';
		$columns    = ! empty( $this->settings['columns'] ) ? (int) $this->settings['columns'] : 1;
		$row_gap    = ! empty( $this->settings['row_gap'] ) ? $this->settings['row_gap'] : '2px';
		$column_gap = ! empty( $this->settings['column_gap'] ) ? $this->settings['column_gap'] : '40px';
		$fill_color = $this->get_raw_color( 'fill_color' );
		if ( empty( $fill_color ) ) {
			$fill_color = 'var(--bricks-color-primary)';
		}

		// Ensure star_size has a unit for CSS.
		if ( is_numeric( $star_size ) ) {
			$star_size = $star_size . 'px';
		}

		if ( $this->is_admin_editor() ) {
			$this->render_preview( $star_size, $fill_color, $columns, $column_gap, $row_gap );
			return;
		}

		$rendered_attributes = $this->get_block_rendered_attributes();

		$attributes = [
			'size'       => $star_size,
			'columns'    => $columns,
			'row_gap'    => $row_gap,
			'column_gap' => $column_gap,
			'fill_color' => esc_attr( $fill_color ),
			'className'  => $rendered_attributes['class'],
			'anchor'     => $rendered_attributes['id'],
		];

		// Render the breakdown block directly without the summary wrapper.
		// The summary wrapper causes width issues in flex containers.
		$block_content = '<!-- wp:surecart/product-review-breakdown ' . wp_json_encode( $attributes ) . ' /-->';

		// Use sc_pre_render_blocks to handle interactivity API debug notices.
		echo sc_pre_render_blocks( $block_content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Render preview in editor.
	 *
	 * @param string $star_size Star size with unit.
	 * @param string $fill_color Fill color.
	 * @param int    $columns Number of columns.
	 * @param string $column_gap Column gap with unit.
	 * @param string $row_gap Row gap with unit.
	 *
	 * @return void
	 */
	private function render_preview( $star_size = '20px', $fill_color = '', $columns = 1, $column_gap = '20px', $row_gap = '2px' ) {
		$breakdown_data = [
			5 => 45,
			4 => 25,
			3 => 10,
			2 => 5,
			1 => 3,
		];
		$total          = array_sum( $breakdown_data );

		if ( empty( $fill_color ) ) {
			$fill_color = 'var(--bricks-color-primary)';
		}

		// Use CSS Grid for proper column layout (matching the actual block).
		$grid_style = 'display: grid; width: 100%; min-width: 0; column-gap: ' . esc_attr( $column_gap ) . ';';
		if ( 2 === $columns ) {
			$grid_style .= ' grid-template-columns: repeat(2, 1fr); grid-auto-flow: column; grid-template-rows: repeat(3, minmax(auto, 1fr));';
		} elseif ( 3 === $columns ) {
			$grid_style .= ' grid-template-columns: repeat(3, 1fr); grid-auto-flow: column; grid-template-rows: repeat(2, minmax(auto, 1fr));';
		} else {
			$grid_style .= ' grid-template-columns: 1fr;';
		}

		$content = '<div style="width: 100%; min-width: 0; overflow: hidden;"><div class="sc-star-bars sc-star-bars__columns-' . esc_attr( $columns ) . '" style="' . esc_attr( $grid_style ) . '">';
		for ( $star = 5; $star >= 1; $star-- ) {
			$count      = $breakdown_data[ $star ];
			$percentage = $total > 0 ? ( $count / $total ) * 100 : 0;

			$content .= '<a href="#" class="sc-star-row" onclick="event.preventDefault();" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: inherit; cursor: pointer; transition: opacity 0.2s ease;">';
			$content .= '<div class="sc-star-row__label" style="display: flex; align-items: center; justify-content: center; min-width: 35px; gap: 4px;">';
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
			$content .= '<div class="sc-star-row__bar" style="flex: 1; height: 8px; border-radius: 4px; overflow: hidden; position: relative; min-width: 50px;">';
			$content .= '<div class="sc-star-row__bar-fill" style="height: 100%; border-radius: 4px; width: ' . esc_attr( $percentage ) . '%; transition: width 0.3s ease;"></div>';
			$content .= '</div>';
			$content .= '<div class="sc-star-row__count" style="text-align: right;min-width: 20px;">' . esc_html( $count ) . '</div>';
			$content .= '</a>';
		}
		$content .= '</div></div>'; // Close both the grid and overflow wrapper.

		echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$content,
			'wp-block-surecart-product-review-breakdown',
			'div'
		);
	}
}
