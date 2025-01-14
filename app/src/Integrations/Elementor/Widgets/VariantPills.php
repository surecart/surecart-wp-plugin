<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Variant Pills widget.
 */
class VariantPills extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-variant-pills';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Variant Pills', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-product-categories';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'variants', 'variant', 'pills' );
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return array( 'surecart-elementor-product' );
	}

	/**
	 * Get style dependencies.
	 *
	 * @return array Element styles dependencies.
	 */
	public function get_style_depends() {
		return array( 'surecart-product-variants', 'surecart-pill' );
	}

	/**
	 * Register the widget style settings.
	 *
	 * @return void
	 */
	private function register_style_settings() {
		$this->start_controls_section(
			'section_variant_pills_style',
			[
				'label' => esc_html__( 'Variant pills', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-variant-pills' => 'color: {{VALUE}}',
				],
			]
		);

		$this->add_responsive_control(
			'pill_gap',
			[
				'label'       => esc_html__( 'Gap', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SLIDER,
				'size_units'  => [ 'px', 'em', '%' ],
				'description' => esc_html__( 'Space between each pill.', 'surecart' ),
				'range'       => [
					'px' => [
						'min'  => 0,
						'step' => 1,
						'max'  => 100,
					],
					'em' => [
						'min'  => 0,
						'step' => 0.1,
						'max'  => 10,
					],
					'%'  => [
						'min'  => 0,
						'step' => 1,
						'max'  => 100,
					],
				],
				'selectors'   => [
					'{{WRAPPER}} .sc-pill-option__wrapper' => 'gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_variant_pill_style',
			[
				'label' => esc_html__( 'Variant pill', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'pill_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sc-pill-option__wrapper .wp-block-surecart-product-variant-pill:not(.sc-pill-option__button--selected)' => 'color: {{VALUE}}',
				],
				'default'   => '#FFFFFF',
			]
		);

		$this->add_control(
			'pill_background_color',
			[
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					'{{WRAPPER}} .sc-pill-option__wrapper .wp-block-surecart-product-variant-pill:not(.sc-pill-option__button--selected)' => 'background-color: {{VALUE}}',
				],
			]
		);

		$this->add_control(
			'pill_highlight_text_color',
			[
				'label'     => esc_html__( 'Highlight Text', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sc-pill-option__wrapper .wp-block-surecart-product-variant-pill.sc-pill-option__button--selected' => 'color: {{VALUE}}',
				],
			]
		);

		$this->add_control(
			'pill_highlight_background_color',
			[
				'label'     => esc_html__( 'Highlight Background', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sc-pill-option__wrapper .wp-block-surecart-product-variant-pill.sc-pill-option__button--selected' => 'background-color: {{VALUE}}',
				],
			]
		);

		$this->add_control(
			'pill_highlight_border_color',
			[
				'label'     => esc_html__( 'Highlight Border', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sc-pill-option__wrapper .wp-block-surecart-product-variant-pill.sc-pill-option__button--selected' => 'border-color: {{VALUE}}',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'pill_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => '{{WRAPPER}} .sc-pill-option__wrapper .wp-block-surecart-product-variant-pill',
			]
		);

		$this->add_responsive_control(
			'pill_padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .sc-pill-option__wrapper .wp-block-surecart-product-variant-pill' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'pill_margin',
			[
				'label'      => esc_html__( 'Margin', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .sc-pill-option__wrapper .wp-block-surecart-product-variant-pill' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'      => 'pill_border',
				'selector'  => '{{WRAPPER}} .sc-pill-option__wrapper .wp-block-surecart-product-variant-pill',
				'separator' => 'before',
			]
		);

		$this->add_control(
			'pill_border_radius',
			[
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .sc-pill-option__wrapper .wp-block-surecart-product-variant-pill' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
		$this->register_style_settings();
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$this->content_template();
			return;
		}

		// If product has no variants, return.
		if ( empty( sc_get_product()->variant_options->data ?? [] ) ) {
			return;
		}

		$settings           = $this->get_settings_for_display();
		$variant_attributes = array(
			'highlight_text'       => $settings['pill_highlight_text_color'] ?? '',
			'highlight_background' => $settings['pill_highlight_background_color'] ?? '',
			'highlight_border'     => $settings['pill_highlight_border_color'] ?? '',
		);

		?>
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
		<!-- wp:surecart/product-variant-pills -->
		<!-- wp:surecart/product-variant-pill <?php echo wp_json_encode( $variant_attributes ); ?> /-->
		<!-- /wp:surecart/product-variant-pills -->
		</div>
		<?php
	}

	/**
	 * Render the widget output on the editor.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<div class="wp-block-surecart-product-variant-pills">
			<label class="sc-form-label"><?php echo esc_html__( 'Color', 'surecart' ); ?></label>
			<div class="sc-pill-option__wrapper">
				<div class="sc-pill-option__button wp-block-surecart-product-variant-pill sc-pill-option__button--selected"><?php echo esc_html__( 'Red', 'surecart' ); ?></div>
				<div class="sc-pill-option__button wp-block-surecart-product-variant-pill"><?php echo esc_html__( 'Blue', 'surecart' ); ?></div>
				<div class="sc-pill-option__button wp-block-surecart-product-variant-pill"><?php echo esc_html__( 'Green', 'surecart' ); ?></div>
			</div>
		</div>
		<?php
	}
}
