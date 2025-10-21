<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Review Breakdown widget.
 */
class ReviewBreakdown extends \Elementor\Widget_Base {
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
			'section_review_breakdown',
			[
				'label' => esc_html__( 'Review Breakdown', 'surecart' ),
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
				'default'      => 'yes',
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
					'size' => 25,
					'unit' => 'px',
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
		$this->start_controls_section(
			'section_review_breakdown_style',
			array(
				'label' => esc_html__( 'Breakdown Style', 'surecart' ),
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
					'{{WRAPPER}} .sc-star-label svg' => 'fill: {{VALUE}}; stroke: {{VALUE}}; color: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'bar_color',
			array(
				'label'     => esc_html__( 'Bar Fill Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					'{{WRAPPER}} .sc-bar-fill' => 'background-color: {{VALUE}};',
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
					'{{WRAPPER}} .sc-bar-wrap' => 'background-color: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-review-breakdown' => 'color: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'hover_background_color',
			array(
				'label'     => esc_html__( 'Row Hover Background', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sc-star-row:hover' => 'background-color: {{VALUE}};',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-review-breakdown',
			]
		);

		$this->add_responsive_control(
			'row_spacing',
			[
				'label'      => esc_html__( 'Row Spacing', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
					'em' => [
						'min'  => 0,
						'max'  => 5,
						'step' => 0.1,
					],
				],
				'default'    => [
					'size' => 8,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .sc-star-row'            => 'margin-bottom: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .sc-star-row:last-child' => 'margin-bottom: 0;',
				],
			]
		);

		$this->add_control(
			'bar_height',
			[
				'label'      => esc_html__( 'Bar Height', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range'      => [
					'px' => [
						'min' => 5,
						'max' => 30,
					],
				],
				'default'    => [
					'size' => 12,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .sc-bar-wrap' => 'height: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'bar_radius',
			[
				'label'      => esc_html__( 'Bar Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
					'%'  => [
						'min' => 0,
						'max' => 100,
					],
				],
				'default'    => [
					'size' => 4,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .sc-bar-wrap' => 'border-radius: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .sc-bar-fill' => 'border-radius: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-review-breakdown' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'margin',
			[
				'label'      => esc_html__( 'Margin', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-review-breakdown' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
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
		$show_for_zero_reviews = 'yes' === ( $settings['show_for_zero_reviews'] ?? 'yes' );
		$star_size             = $settings['star_size']['size'] ?? 25;

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$this->render_preview( $star_size );
			return;
		}

		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-review-summary -->
			<!-- wp:surecart/product-review-breakdown {"show_for_zero_reviews":<?php echo $show_for_zero_reviews ? 'true' : 'false'; ?>,"size":<?php echo absint( $star_size ); ?>} /-->
			<!-- /wp:surecart/product-review-summary -->
		</div>
		<?php
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
		?>
		<div class="wp-block-surecart-product-review-breakdown">
			<div class="sc-star-bars">
				<?php
				for ( $star = 5; $star >= 1; $star-- ) {
					$count      = $breakdown_data[ $star ];
					$percentage = $total > 0 ? ( $count / $total ) * 100 : 0;
					?>
					<a href="#" class="sc-star-row" onclick="event.preventDefault();">
						<div class="sc-star-label">
							<?php echo esc_html( $star ); ?>
							<svg height="<?php echo esc_attr( $star_size ); ?>" width="<?php echo esc_attr( $star_size ); ?>" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
								<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
							</svg>
						</div>
						<div class="sc-bar-wrap">
							<div class="sc-bar-fill" style="width: <?php echo esc_attr( $percentage ); ?>%;"></div>
						</div>
						<div class="sc-count"><?php echo esc_html( $count ); ?></div>
					</a>
					<?php
				}
				?>
			</div>
		</div>
		<style>
			.wp-block-surecart-product-review-breakdown .sc-star-bars {
				display: flex;
				flex-direction: column;
				gap: 8px;
			}
			.wp-block-surecart-product-review-breakdown .sc-star-row {
				display: flex;
				align-items: center;
				gap: 12px;
				text-decoration: none;
				color: inherit;
				padding: 8px;
				border-radius: 4px;
				transition: background-color 0.2s;
			}
			.wp-block-surecart-product-review-breakdown .sc-star-label {
				display: flex;
				align-items: center;
				gap: 4px;
				min-width: 50px;
			}
			.wp-block-surecart-product-review-breakdown .sc-bar-wrap {
				flex: 1;
				height: 12px;
				background-color: #e0e0e0;
				border-radius: 4px;
				overflow: hidden;
			}
			.wp-block-surecart-product-review-breakdown .sc-bar-fill {
				height: 100%;
				background-color: var(--e-global-color-primary, #6c63ff);
				border-radius: 4px;
				transition: width 0.3s;
			}
			.wp-block-surecart-product-review-breakdown .sc-count {
				min-width: 30px;
				text-align: right;
			}
		</style>
		<?php
	}

	/**
	 * Render the widget output on the editor.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<#
		var starSize = settings.star_size.size || 25;
		var breakdownData = {5: 45, 4: 25, 3: 10, 2: 5, 1: 3};
		var total = 88;
		#>
		<div class="wp-block-surecart-product-review-breakdown">
			<div class="sc-star-bars">
				<# for (var star = 5; star >= 1; star--) {
					var count = breakdownData[star];
					var percentage = (count / total) * 100;
				#>
					<a href="#" class="sc-star-row" onclick="event.preventDefault();">
						<div class="sc-star-label">
							{{ star }}
							<svg height="{{ starSize }}" width="{{ starSize }}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
								<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
							</svg>
						</div>
						<div class="sc-bar-wrap">
							<div class="sc-bar-fill" style="width: {{ percentage }}%;"></div>
						</div>
						<div class="sc-count">{{ count }}</div>
					</a>
				<# } #>
			</div>
		</div>
		<style>
			.wp-block-surecart-product-review-breakdown .sc-star-bars {
				display: flex;
				flex-direction: column;
				gap: 8px;
			}
			.wp-block-surecart-product-review-breakdown .sc-star-row {
				display: flex;
				align-items: center;
				gap: 12px;
				text-decoration: none;
				color: inherit;
				padding: 8px;
				border-radius: 4px;
				transition: background-color 0.2s;
			}
			.wp-block-surecart-product-review-breakdown .sc-star-label {
				display: flex;
				align-items: center;
				gap: 4px;
				min-width: 50px;
			}
			.wp-block-surecart-product-review-breakdown .sc-bar-wrap {
				flex: 1;
				height: 12px;
				background-color: #e0e0e0;
				border-radius: 4px;
				overflow: hidden;
			}
			.wp-block-surecart-product-review-breakdown .sc-bar-fill {
				height: 100%;
				background-color: var(--e-global-color-primary, #6c63ff);
				border-radius: 4px;
				transition: width 0.3s;
			}
			.wp-block-surecart-product-review-breakdown .sc-count {
				min-width: 30px;
				text-align: right;
			}
		</style>
		<?php
	}
}
