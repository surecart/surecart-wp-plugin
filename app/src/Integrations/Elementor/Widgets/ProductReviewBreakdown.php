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
			'show_for_zero_reviews',
			[
				'label'        => esc_html__( 'Show For Zero Reviews', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Show', 'surecart' ),
				'label_off'    => esc_html__( 'Hide', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'no',
				'description'  => esc_html__( 'Display the breakdown even when there are zero reviews.', 'surecart' ),
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
						'min' => 10,
						'max' => 50,
					],
				],
				'default'    => [
					'size' => 20,
					'unit' => 'px',
				],
			]
		);

		$this->add_control(
			'star_label_gap',
			[
				'label'       => esc_html__( 'Star Label Gap', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SLIDER,
				'size_units'  => [ 'px' ],
				'range'       => [
					'px' => [
						'min' => 0,
						'max' => 20,
					],
				],
				'default'     => [
					'size' => 4,
					'unit' => 'px',
				],
				'description' => esc_html__( 'Adjust the spacing between the star number and star icon.', 'surecart' ),
				'selectors'   => [
					'{{WRAPPER}} .wp-block-surecart-product-review-breakdown .sc-star-label' => 'gap: {{SIZE}}{{UNIT}};',
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
				'description' => esc_html__( 'Choose the number of columns to display the review breakdown.', 'surecart' ),
			]
		);

		$this->add_control(
			'row_gap',
			[
				'label'       => esc_html__( 'Row Gap', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SLIDER,
				'size_units'  => [ 'px' ],
				'range'       => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
				],
				'default'     => [
					'size' => 20,
					'unit' => 'px',
				],
				'description' => esc_html__( 'Adjust the spacing between rows.', 'surecart' ),
				'selectors'   => [
					'{{WRAPPER}} .wp-block-surecart-product-review-breakdown .sc-star-bars' => 'row-gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'column_gap',
			[
				'label'       => esc_html__( 'Column Gap', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SLIDER,
				'size_units'  => [ 'px' ],
				'range'       => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
				],
				'default'     => [
					'size' => 20,
					'unit' => 'px',
				],
				'description' => esc_html__( 'Adjust the spacing between columns.', 'surecart' ),
				'selectors'   => [
					'{{WRAPPER}} .wp-block-surecart-product-review-breakdown .sc-star-bars' => 'column-gap: {{SIZE}}{{UNIT}};',
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
		$bar_selector  = '{{WRAPPER}} .wp-block-surecart-product-review-breakdown .sc-star-bars .sc-bar-wrap';
		$fill_selector = '{{WRAPPER}} .wp-block-surecart-product-review-breakdown .sc-star-bars .sc-bar-wrap .sc-bar-fill';

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
					"{$selector} .sc-star-label svg" => 'fill: {{VALUE}}; stroke: {{VALUE}};',
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
		$settings              = $this->get_settings_for_display();
		$show_for_zero_reviews = 'yes' === ( $settings['show_for_zero_reviews'] ?? 'no' );
		$star_size             = $settings['star_size']['size'] ?? 20;
		$star_label_gap        = $settings['star_label_gap']['size'] ?? 4;
		$columns               = $settings['columns'] ?? 1;
		$row_gap               = $settings['row_gap']['size'] ?? 20;
		$column_gap            = $settings['column_gap']['size'] ?? 20;

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$this->render_preview( $star_size, $columns, $column_gap );
			return;
		}

		$attributes = [
			'show_for_zero_reviews' => $show_for_zero_reviews,
			'size'                  => absint( $star_size ),
			'star_label_gap'        => absint( $star_label_gap ),
			'columns'               => absint( $columns ),
			'row_gap'               => absint( $row_gap ),
			'column_gap'            => absint( $column_gap ),
		];

		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-review-summary -->
			<!-- wp:surecart/product-review-breakdown <?php echo wp_json_encode( $attributes ); ?> /-->
			<!-- /wp:surecart/product-review-summary -->
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

		// Calculate max height for multi-column layouts.
		$max_height = 2 === $columns ? 150 : ( 3 === $columns ? 85 : '' );
		?>
		<div class="wp-block-surecart-product-review-breakdown">
			<div class="sc-star-bars sc-star-bars--columns-<?php echo esc_attr( $columns ); ?>" style="display: flex; flex-direction: column; flex-wrap: wrap; align-content: flex-start; max-height: <?php echo esc_attr( $max_height ); ?>px;">
				<?php
				for ( $star = 5; $star >= 1; $star-- ) {
					$count      = $breakdown_data[ $star ];
					$percentage = $total > 0 ? ( $count / $total ) * 100 : 0;

					// Calculate width for multi-column layouts.
					$width_style = '';
					if ( 2 === $columns ) {
						$width_style = 'width: calc(50% - ' . ( $column_gap / 2 ) . 'px);';
					} elseif ( 3 === $columns ) {
						$width_style = 'width: calc(33.333% - ' . ( $column_gap * 2 / 3 ) . 'px);';
					}
					?>
					<a href="#" class="sc-star-row" onclick="event.preventDefault();" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: inherit; cursor: pointer; transition: opacity 0.2s ease; <?php echo esc_attr( $width_style ); ?>">
						<div class="sc-star-label" style="display: flex; align-items: center;">
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
						<div class="sc-bar-wrap" style="flex: 1; height: 8px; border-radius: 4px; overflow: hidden; position: relative; min-width: 100px;">
							<div class="sc-bar-fill" style="height: 100%; border-radius: 4px; width: <?php echo esc_attr( $percentage ); ?>%; transition: width 0.3s ease;"></div>
						</div>
						<div class="sc-count" style="text-align: right;"><?php echo esc_html( $count ); ?></div>
					</a>
					<?php
				}
				?>
			</div>
		</div>
		<?php
	}
}
