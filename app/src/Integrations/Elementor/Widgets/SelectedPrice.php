<?php

namespace SureCart\Integrations\Elementor\Widgets;

use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Selected Price widget.
 */
class SelectedPrice extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-selected-price';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Selected Price', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-product-price';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'price', 'selected', 'amount' );
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return [ 'surecart-elementor-product' ];
	}

	/**
	 * Get the style dependencies.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array();
	}

	/**
	 * Add custom controls for the widget.
	 *
	 * @return void
	 */
	protected function register_style_settings() {
		// Scratch Amount Styles.
		$this->start_controls_section(
			'section_scratch_amount',
			[
				'label' => esc_html__( 'Scratch Amount', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-selected-price-scratch-amount' => 'color: {{VALUE}}',
				],
				'default'   => '#868585',
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'           => 'scratch_typography',
				'label'          => esc_html__( 'Typography', 'surecart' ),
				'selector'       => '{{WRAPPER}} .wp-block-surecart-product-selected-price-scratch-amount',
				'fields_options' => [
					'font_size' => [
						'default'    => [
							'size' => '24',
							'unit' => 'px',
						],
						'size_units' => [ 'px' ],
					],
				],
			]
		);

		$this->end_controls_section();

		// Price Amount Styles.
		$this->start_controls_section(
			'section_amount_style',
			[
				'label' => esc_html__( 'Price Amount', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'amount_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-selected-price-amount' => 'color: {{VALUE}}',
				],
				'default'   => '#000000',
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'           => 'amount_typography',
				'label'          => esc_html__( 'Typography', 'surecart' ),
				'selector'       => '{{WRAPPER}} .wp-block-surecart-product-selected-price-amount',
				'fields_options' => [
					'font_size' => [
						'default'    => [
							'size' => '24',
							'unit' => 'px',
						],
						'size_units' => [ 'px' ],
					],
				],
			]
		);

		$this->end_controls_section();

		// Price Interval Styles.
		$this->start_controls_section(
			'section_interval_style',
			[
				'label' => esc_html__( 'Price Interval', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'interval_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-selected-price-interval' => 'color: {{VALUE}}',
				],
				'default'   => '#000000',
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'interval_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-selected-price-interval',
			]
		);

		$this->end_controls_section();

		// Sale Badge Styles.
		$this->start_controls_section(
			'section_sale_badge_style',
			[
				'label' => esc_html__( 'Sale Badge', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'badge_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-sale-badge' => 'color: {{VALUE}}',
				],
				'default'   => '#FFFFFF',
			]
		);

		$this->add_control(
			'badge_background_color',
			[
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-sale-badge' => 'background-color: {{VALUE}}',
				],
				'default'   => '#000000',
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'badge_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-sale-badge',
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'     => 'badge_border',
				'label'    => esc_html__( 'Border', 'surecart' ),
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-sale-badge',
				'default'  => 'solid',
			]
		);

		$this->add_control(
			'badge_border_radius',
			[
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-sale-badge' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'default'    => [
					'top'    => '14',
					'right'  => '14',
					'bottom' => '14',
					'left'   => '14',
					'unit'   => 'px',
				],
			]
		);

		$this->add_responsive_control(
			'badge_padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-sale-badge' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'default'    => [
					'top'    => '4',
					'right'  => '10',
					'bottom' => '4',
					'left'   => '10',
					'unit'   => 'px',
				],
			]
		);

		$this->end_controls_section();

		// Trial Text Styles.
		$this->start_controls_section(
			'section_trial_style',
			[
				'label' => esc_html__( 'Price Trial', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'trial_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-selected-price-trial' => 'color: {{VALUE}}',
				],
				'default'   => '#000000',
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'trial_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-selected-price-trial',
			]
		);

		$this->end_controls_section();

		// Setup Fee Styles.
		$this->start_controls_section(
			'section_fees_style',
			[
				'label' => esc_html__( 'Price Fees', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'fees_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-selected-price-fees' => 'color: {{VALUE}}',
				],
				'default'   => '#000000',
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'fees_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-selected-price-fees',
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
		$this->register_style_settings();
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$this->content_template();
			return;
		}

		?>
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
			<div class="wp-block-group">
				<!-- wp:group {"style":{"spacing":{"blockGap":"0.5em"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"left","verticalAlignment":"bottom"}} -->
				<div class="wp-block-group">
					<!-- wp:surecart/product-selected-price-scratch-amount {"style":{"typography":{"textDecoration":"line-through","lineHeight":"1.5"},"color":{"text":"#686868"},"elements":{"link":{"color":{"text":"#686868"}}}}} /-->

					<!-- wp:surecart/product-selected-price-amount {"style":{"typography":{"lineHeight":"1.5"}}} /-->

					<!-- wp:surecart/product-selected-price-interval {"style":{"typography":{"lineHeight":"2"}}} /-->

					<!-- wp:surecart/product-sale-badge {"style":{"border":{"radius":"15px"},"typography":{"lineHeight":"2.1"},"layout":{"selfStretch":"fit","flexSize":null},"elements":{"link":{"color":{"text":"var:preset|color|white"}}}},"textColor":"white"} /-->
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render the widget output in the editor.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<div class="wp-block-surecart-selected-price">
			<div class="sc-price-wrapper">
				<span tabindex="0" class="wp-block-surecart-product-selected-price-scratch-amount">
					<?php echo esc_html( Currency::format( 20 ) ); ?>
				</span>
				<span tabindex="0" class="wp-block-surecart-product-selected-price-amount">
					<?php echo esc_html( Currency::format( 15 ) ); ?>
				</span>
				<span tabindex="0" class="wp-block-surecart-product-selected-price-interval">
					/ <?php echo esc_html__( 'mo', 'surecart' ); ?>
				</span>
				<span tabindex="0" class="wp-block-surecart-product-sale-badge">
					<?php echo esc_html__( 'Sale', 'surecart' ); ?>
				</span>
			</div>
			<div class="sc-price-meta">
				<span tabindex="0" class="wp-block-surecart-product-selected-price-trial">
					<?php echo esc_html__( 'Starting in 7 days.', 'surecart' ); ?>
				</span>
				<span tabindex="0" class="wp-block-surecart-product-selected-price-fees">
					<?php echo esc_html( Currency::format( 10 ) . ' ' . __( 'Setup Fee', 'surecart' ) ); ?>
				</span>
			</div>
		</div>
		<?php
	}
}
