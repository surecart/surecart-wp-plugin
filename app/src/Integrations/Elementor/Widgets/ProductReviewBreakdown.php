<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Review Breakdown widget.
 */
class ProductReviewBreakdown extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-review-breakdown';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Review Breakdown', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-slider-push';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'review', 'breakdown', 'rating', 'stars', 'chart' );
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return array( 'surecart-elementor-elements' );
	}

	/**
	 * Register the widget content settings.
	 *
	 * @return void
	 */
	private function register_content_settings() {
		$this->start_controls_section(
			'settings',
			[
				'label' => esc_html__( 'Settings', 'surecart' ),
			]
		);

		$this->add_control(
			'star_size',
			[
				'label'      => esc_html__( 'Star Size', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range'      => [
					'px' => [
						'min' => 8,
						'max' => 64,
					],
				],
				'default'    => [
					'size' => 20,
					'unit' => 'px',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'column_spacing',
			array(
				'label' => esc_html__( 'Column & Spacing', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'columns',
			[
				'label'       => esc_html__( 'Columns', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SELECT,
				'options'     => [
					'1' => esc_html__( '1 Column', 'surecart' ),
					'2' => esc_html__( '2 Columns', 'surecart' ),
					'3' => esc_html__( '3 Columns', 'surecart' ),
				],
				'default'     => '1',
				'description' => esc_html__( 'Choose the number of columns to display the review breakdown. Keep in mind the number of columns may shrink if the width is too narrow.', 'surecart' ),
			]
		);

		$this->add_control(
			'row_gap',
			[
				'label'      => esc_html__( 'Row Gap', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
				],
				'default'    => [
					'size' => 2,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-review-breakdown .sc-star-bars' => 'row-gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'column_gap',
			[
				'label'      => esc_html__( 'Column Gap', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'default'    => [
					'size' => 20,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-review-breakdown .sc-star-bars' => 'column-gap: {{SIZE}}{{UNIT}};',
				],
				'condition'  => [
					'columns' => [ '2', '3' ],
				],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget style settings.
	 *
	 * @return void
	 */
	private function register_style_settings() {
		$selector      = '{{WRAPPER}} .wp-block-surecart-product-review-breakdown';
		$bar_selector  = '{{WRAPPER}} .wp-block-surecart-product-review-breakdown .sc-star-bars .sc-star-row__bar';
		$fill_selector = '{{WRAPPER}} .wp-block-surecart-product-review-breakdown .sc-star-bars .sc-star-row__bar .sc-star-row__bar-fill';

		$this->start_controls_section(
			'star_bar_style',
			array(
				'label' => esc_html__( 'Star & Bar Colors', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'star_color',
			array(
				'label'     => esc_html__( 'Star Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					"{$selector} .sc-star-row svg" => 'fill: {{VALUE}}; stroke: {{VALUE}};',
					"{$selector} .sc-star-row .sc-star-icon" => 'fill: {{VALUE}}; stroke: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'bar_color',
			array(
				'label'     => esc_html__( 'Bar Active Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					$fill_selector => 'background-color: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'bar_background_color',
			array(
				'label'     => esc_html__( 'Bar Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'default'   => '#e0e0e0',
				'selectors' => [
					$bar_selector => 'background-color: {{VALUE}};',
				],
			)
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'labels_style',
			array(
				'label' => esc_html__( 'Label & Count Text', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$selector => 'color: {{VALUE}};',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => $selector,
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->register_content_settings();
		$this->register_style_settings();
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		$settings   = $this->get_settings_for_display();
		$star_size  = $settings['star_size']['size'] ?? 20;
		$columns    = $settings['columns'] ?? 1;
		$row_gap    = $settings['row_gap']['size'] ?? 2;
		$column_gap = $settings['column_gap']['size'] ?? 20;

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$this->render_preview( $star_size, $columns, $column_gap );
			return;
		}

		$attributes = [
			'size'       => absint( $star_size ) . 'px',
			'columns'    => absint( $columns ),
			'row_gap'    => absint( $row_gap ) . 'px',
			'column_gap' => absint( $column_gap ) . 'px',
		];

		// The summary wrapper causes width issues in flex containers.
		$block_content = '<!-- wp:surecart/product-review-breakdown ' . wp_json_encode( $attributes ) . ' /-->';

		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<?php echo sc_pre_render_blocks( $block_content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<?php
	}

	/**
	 * Render preview in editor.
	 *
	 * @param int $star_size Star size.
	 * @param int $columns Number of columns.
	 * @param int $column_gap Column gap in pixels.
	 *
	 * @return void
	 */
	private function render_preview( $star_size, $columns = 1, $column_gap = 20 ) {
		$breakdown_data = [
			5 => 45,
			4 => 25,
			3 => 10,
			2 => 5,
			1 => 3,
		];
		$total          = array_sum( $breakdown_data );
		$columns        = absint( $columns );
		$column_gap     = absint( $column_gap );

		// Use CSS Grid for proper column layout (matching the actual block).
		$grid_style = 'display: grid; width: 100%; row-gap: 2px; column-gap: ' . esc_attr( $column_gap ) . 'px;';
		if ( 2 === $columns ) {
			$grid_style .= ' grid-template-columns: repeat(2, 1fr); grid-auto-flow: column; grid-template-rows: repeat(3, minmax(auto, 1fr));';
		} elseif ( 3 === $columns ) {
			$grid_style .= ' grid-template-columns: repeat(3, 1fr); grid-auto-flow: column; grid-template-rows: repeat(2, minmax(auto, 1fr));';
		} else {
			$grid_style .= ' grid-template-columns: 1fr;';
		}
		?>
		<div class="wp-block-surecart-product-review-breakdown">
			<div class="sc-star-bars sc-star-bars__columns-<?php echo esc_attr( $columns ); ?>" style="<?php echo esc_attr( $grid_style ); ?>">
				<?php
				for ( $star = 5; $star >= 1; $star-- ) {
					$count      = $breakdown_data[ $star ];
					$percentage = $total > 0 ? ( $count / $total ) * 100 : 0;
					?>
					<a href="#" class="sc-star-row" onclick="event.preventDefault();" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: inherit; cursor: pointer; transition: opacity 0.2s ease;">
						<div class="sc-star-row__label" style="display: flex; align-items: center; min-width: 35px; gap: 4px;">
							<?php echo esc_html( $star ); ?>
							<?php
								echo wp_kses(
									\SureCart::svg()->get(
										'star',
										[
											'width'        => esc_attr( $star_size ),
											'height'       => esc_attr( $star_size ),
											'fill'         => 'currentColor',
											'stroke'       => 'currentColor',
											'stroke-width' => 2,
										]
									),
									sc_allowed_svg_html()
								)
							?>
						</div>
						<div class="sc-star-row__bar" style="flex: 1; height: 8px; border-radius: 4px; overflow: hidden; position: relative; min-width: 100px;">
							<div class="sc-star-row__bar-fill" style="height: 100%; border-radius: 4px; width: <?php echo esc_attr( $percentage ); ?>%; transition: width 0.3s ease;"></div>
						</div>
						<div class="sc-star-row__count" style="text-align: right; min-width: 20px;"><?php echo esc_html( $count ); ?></div>
					</a>
					<?php
				}
				?>
			</div>
		</div>
		<?php
	}
}
