<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Buy now button widget.
 */
class BuyButton extends AddToCartButton {
	/**
	 * Is this an add to cart button?
	 *
	 * @var boolean
	 */
	protected const IS_ADD_TO_CART = false;

	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-buy-button';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Buy Now Button', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-product-add-to-cart';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'buy', 'now', 'button' );
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
	 * Get the default button label.
	 *
	 * @return string
	 */
	protected function get_default_label(): string {
		return esc_html__( 'Buy Now', 'surecart' );
	}

	/**
	 * Register the widget style settings.
	 *
	 * @return void
	 */
	protected function register_style_settings(): void {
		$button_selector       = '{{WRAPPER}} .wp-block-button__link';
		$button_hover_selector = '{{WRAPPER}} .wp-block-button__link:hover';

		$this->start_controls_section(
			'section_style',
			[
				'label' => esc_html__( 'Button', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'button_typography',
				'global'   => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Typography::TYPOGRAPHY_PRIMARY,
				],
				'selector' => $button_selector,
			]
		);

		$this->add_control(
			'button_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$button_selector       => 'color: {{VALUE}}',
					$button_hover_selector => 'color: {{VALUE}}',
				],
				'default'   => '#000000',
			]
		);

		$this->add_control(
			'button_background_color',
			[
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$button_selector => 'background-color: {{VALUE}}',
				],
				'default'   => '#FFFFFF',
			]
		);

		$this->add_responsive_control(
			'button_width',
			array(
				'label'      => esc_html__( 'Width', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => array(
					$button_selector => 'width: {{SIZE}}{{UNIT}};',
				),
				'default'    => [
					'size' => 100,
					'unit' => '%',
				],
				'range'      => [
					'px' => array(
						'min' => 0,
						'max' => 1000,
					),
					'em' => array(
						'min'  => 0,
						'step' => 0.1,
						'max'  => 10,
					),
				],
			)
		);

		$this->add_responsive_control(
			'button_padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					$button_selector => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'     => 'button_border',
				'selector' => $button_selector,
			],
		);

		$this->add_control(
			'button_border_radius',
			array(
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => array(
					$button_selector => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->end_controls_section();
	}
}
