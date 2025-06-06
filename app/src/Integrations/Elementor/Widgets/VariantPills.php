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
		return esc_html__( 'Product Variant Pills', 'surecart' );
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
		return array( 'surecart', 'variants', 'variant', 'pills', 'product' );
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
		$wrapper_selector              = '{{WRAPPER}} .wp-block-surecart-product-variant-pills__wrapper';
		$pills_selector                = '{{WRAPPER}} .wp-block-surecart-product-variant-pills';
		$pill_options_wrapper_selector = '{{WRAPPER}} .sc-pill-option__wrapper';

		$this->start_controls_section(
			'section_variant_pills_layout_style',
			[
				'label' => esc_html__( 'Layout', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'variant_pills_wrapper_container_type',
			[
				'label'            => esc_html__( 'Container Layout', 'surecart' ),
				'type'             => \Elementor\Controls_Manager::SELECT,
				'default'          => 'flex',
				'options'          => [
					'flex' => esc_html__( 'Flexbox', 'surecart' ),
				],
				'selectors'        => [
					$wrapper_selector => '--display: {{VALUE}}; display: {{VALUE}}',
				],
				'separator'        => 'after',
				'editor_available' => true,
			]
		);

		$this->add_control(
			'variant_pills_wrapper_flex_direction',
			[
				'label'            => esc_html__( 'Flex Direction', 'surecart' ),
				'type'             => \Elementor\Controls_Manager::SELECT,
				'default'          => 'column',
				'options'          => [
					'row'    => esc_html__( 'Row', 'surecart' ),
					'column' => esc_html__( 'Column', 'surecart' ),
				],
				'selectors'        => [
					$wrapper_selector => 'flex-direction: {{VALUE}}',
				],
				'editor_available' => true,
			]
		);

		$this->add_control(
			'variant_pills_wrapper_flex_gap',
			[
				'label'            => esc_html__( 'Flex Gap', 'surecart' ),
				'type'             => \Elementor\Controls_Manager::SLIDER,
				'size_units'       => [ 'px', 'em', '%' ],
				'default'          => [
					'size' => 15,
					'unit' => 'px',
				],
				'selectors'        => [
					$wrapper_selector => 'gap: {{SIZE}}{{UNIT}}',
				],
				'editor_available' => true,
			]
		);

		$this->add_control(
			'variant_pills_wrapper_flex_justify_content',
			[
				'label'            => esc_html__( 'Justify Content', 'surecart' ),
				'type'             => \Elementor\Controls_Manager::SELECT,
				'default'          => 'flex-start',
				'options'          => [
					'flex-start'    => esc_html__( 'Start', 'surecart' ),
					'flex-end'      => esc_html__( 'End', 'surecart' ),
					'center'        => esc_html__( 'Center', 'surecart' ),
					'space-between' => esc_html__( 'Space Between', 'surecart' ),
					'space-around'  => esc_html__( 'Space Around', 'surecart' ),
					'space-evenly'  => esc_html__( 'Space Evenly', 'surecart' ),
				],
				'selectors'        => [
					$wrapper_selector => 'justify-content: {{VALUE}}',
				],
				'editor_available' => true,
			]
		);

		$this->add_control(
			'variant_pills_wrapper_flex_align_items',
			[
				'label'            => esc_html__( 'Align Items', 'surecart' ),
				'type'             => \Elementor\Controls_Manager::SELECT,
				'default'          => 'flex-start',
				'options'          => [
					'flex-start' => esc_html__( 'Start', 'surecart' ),
					'flex-end'   => esc_html__( 'End', 'surecart' ),
					'center'     => esc_html__( 'Center', 'surecart' ),
					'stretch'    => esc_html__( 'Stretch', 'surecart' ),
					'baseline'   => esc_html__( 'Baseline', 'surecart' ),
				],
				'selectors'        => [
					$wrapper_selector => 'align-items: {{VALUE}}',
				],
				'editor_available' => true,
			]
		);

		$this->add_control(
			'variant_pills_wrapper_flex_wrap',
			[
				'label'            => esc_html__( 'Flex Wrap', 'surecart' ),
				'type'             => \Elementor\Controls_Manager::SELECT,
				'default'          => 'wrap',
				'options'          => [
					'nowrap'       => esc_html__( 'No Wrap', 'surecart' ),
					'wrap'         => esc_html__( 'Wrap', 'surecart' ),
					'wrap-reverse' => esc_html__( 'Wrap Reverse', 'surecart' ),
				],
				'selectors'        => [
					$wrapper_selector => 'flex-wrap: {{VALUE}}',
				],
				'editor_available' => true,
			]
		);

		$this->add_control(
			'variant_pills_wrapper_flex_align_content',
			[
				'label'            => esc_html__( 'Align Content', 'surecart' ),
				'type'             => \Elementor\Controls_Manager::SELECT,
				'default'          => 'flex-start',
				'options'          => [
					'flex-start'    => esc_html__( 'Start', 'surecart' ),
					'flex-end'      => esc_html__( 'End', 'surecart' ),
					'center'        => esc_html__( 'Center', 'surecart' ),
					'space-between' => esc_html__( 'Space Between', 'surecart' ),
					'space-around'  => esc_html__( 'Space Around', 'surecart' ),
					'space-evenly'  => esc_html__( 'Space Evenly', 'surecart' ),
				],
				'selectors'        => [
					$wrapper_selector => 'align-content: {{VALUE}}',
				],
				'editor_available' => true,
			]
		);

		$this->end_controls_section();

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
					$pills_selector                     => 'color: {{VALUE}}',
					$pills_selector . ' .sc-form-label' => 'color: {{VALUE}}',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'pills_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => $pills_selector . ' .sc-form-label',
			]
		);

		$this->add_responsive_control(
			'pill_gap',
			[
				'label'       => esc_html__( 'Pill Gap', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SLIDER,
				'size_units'  => [ 'px', 'em', '%' ],
				'description' => esc_html__( 'Space between each pill.', 'surecart' ),
				'range'       => [
					'px' => [
						'min'  => 0,
						'step' => 1,
						'max'  => 1000,
					],
					'em' => [
						'min'  => 0,
						'step' => 0.1,
						'max'  => 10,
					],
				],
				'selectors'   => [
					$pill_options_wrapper_selector => 'gap: {{SIZE}}{{UNIT}};',
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
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
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
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
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

		$this->add_render_attribute( 'wrapper', 'class', 'wp-block-surecart-product-variant-pills__wrapper' );
		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
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
			<div class="wp-block-surecart-product-variant-pills__wrapper">
				<div class="wp-block-surecart-product-variant-pills">
					<label class="sc-form-label"><?php echo esc_html__( 'Color', 'surecart' ); ?></label>
					<div class="sc-pill-option__wrapper">
						<div class="sc-pill-option__button wp-block-surecart-product-variant-pill sc-pill-option__button--selected"><?php echo esc_html__( 'Red', 'surecart' ); ?></div>
						<div class="sc-pill-option__button wp-block-surecart-product-variant-pill"><?php echo esc_html__( 'Blue', 'surecart' ); ?></div>
						<div class="sc-pill-option__button wp-block-surecart-product-variant-pill"><?php echo esc_html__( 'Green', 'surecart' ); ?></div>
					</div>
				</div>
				<div class="wp-block-surecart-product-variant-pills">
					<label class="sc-form-label"><?php echo esc_html__( 'Size', 'surecart' ); ?></label>
					<div class="sc-pill-option__wrapper">
						<div class="sc-pill-option__button wp-block-surecart-product-variant-pill sc-pill-option__button--selected"><?php echo esc_html__( 'Small', 'surecart' ); ?></div>
						<div class="sc-pill-option__button wp-block-surecart-product-variant-pill"><?php echo esc_html__( 'Medium', 'surecart' ); ?></div>
						<div class="sc-pill-option__button wp-block-surecart-product-variant-pill"><?php echo esc_html__( 'Large', 'surecart' ); ?></div>
					</div>
				</div>
			</div>
		<?php
	}
}
