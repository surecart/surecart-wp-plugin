<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Buy Button widget.
 */
class BuyButton extends \Elementor\Widget_Base {
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
		return esc_html__( 'Add To Cart', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-cart';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'buy', 'cart', 'button' );
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
	 * Register the widget content settings.
	 *
	 * @return void
	 */
	private function register_content_settings() {
		$this->start_controls_section(
			'section_content',
			[
				'label' => esc_html__( 'Content Settings', 'surecart' ),
			]
		);

		$this->add_control(
			'buy_button_type',
			[
				'label'       => esc_html__( 'Go Directly To Checkout', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SWITCHER,
				'label_on'    => esc_html__( 'Yes', 'surecart' ),
				'label_off'   => esc_html__( 'No', 'surecart' ),
				'default'     => 'no',
				'description' => esc_html__( 'Bypass adding to cart and go directly to the checkout.', 'surecart' ),
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_text_settings',
			[
				'label' => esc_html__( 'Text Settings', 'surecart' ),
			]
		);

		$this->add_control(
			'button_text',
			[
				'label'   => esc_html__( 'Button Text', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__( 'Add To Cart', 'surecart' ),
			]
		);

		$this->add_control(
			'button_out_of_stock_text',
			[
				'label'   => esc_html__( 'Out of stock label', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__( 'Sold Out', 'surecart' ),
			]
		);

		$this->add_control(
			'button_unavailable_text',
			[
				'label'   => esc_html__( 'Unavailable label', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__( 'Unavailable', 'surecart' ),
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
				'selector' => '{{WRAPPER}} .wp-block-button__link',
			]
		);

		$this->add_control(
			'button_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-button__link' => 'color: {{VALUE}}',
				],
			]
		);

		$this->add_control(
			'button_background_color',
			[
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-button__link' => 'background-color: {{VALUE}}',
				],
			]
		);
		$this->add_responsive_control(
			'button_width',
			array(
				'label'      => esc_html__( 'Width', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => array(
					'{{WRAPPER}} .wp-block-button__link' => 'width: {{SIZE}}{{UNIT}};',
				),
				'default'    => [
					'size' => 100,
					'unit' => '%',
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
					'{{WRAPPER}} .wp-block-button__link' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'     => 'button_border',
				'selector' => '{{WRAPPER}} .wp-block_button__link',
			]
		);

		$this->add_control(
			'button_border_radius',
			array(
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => array(
					'{{WRAPPER}} .wp-block_button__link' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
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
		$settings      = $this->get_settings_for_display();
		$is_buy_button = 'yes' === $settings['buy_button_type'];

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			?>
			<div>
				<button class="wp-block-button__link wp-element-button sc-button__link">
					<span class="sc-button__link-text"><?php echo esc_html( $settings['button_text'] ); ?></span>
				</button>
			</div>
			<?php
			return;
		}

		$attributes = array(
			'add_to_cart'       => ! $is_buy_button,
			'text'              => esc_attr( $settings['button_text'] ),
			'out_of_stock_text' => esc_attr( $settings['button_out_of_stock_text'] ),
			'unavailable_text'  => esc_attr( $settings['button_unavailable_text'] ),
		);

		?>
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
		<!-- wp:surecart/product-buy-button <?php echo wp_json_encode( $attributes ); ?> /-->
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
		<div>
			<button class="wp-block-button__link wp-element-button sc-button__link">
				<span class="sc-button__link-text">{{{ settings.button_text }}}</span>
			</button>
		</div>
		<?php
	}
}
