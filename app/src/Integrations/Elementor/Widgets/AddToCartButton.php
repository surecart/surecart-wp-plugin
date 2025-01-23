<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Add to cart button widget.
 */
class AddToCartButton extends \Elementor\Widget_Base {
	/**
	 * Is this an add to cart button?
	 *
	 * @var boolean
	 */
	protected const IS_ADD_TO_CART = true;

	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-add-to-cart-button';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Add To Cart Button', 'surecart' );
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
		return array( 'surecart', 'cart', 'button' );
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
		return esc_html__( 'Add To Cart', 'surecart' );
	}

	/**
	 * Register text settings.
	 *
	 * @return void
	 */
	protected function register_text_settings(): void {
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
				'default' => $this->get_default_label(),
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
	 * Register the widget content settings.
	 *
	 * @return void
	 */
	protected function register_content_settings() {
		$this->register_text_settings();
	}

	/**
	 * Register the widget style settings.
	 *
	 * @return void
	 */
	protected function register_style_settings() {
		$button_selector = '{{WRAPPER}} .wp-block-button__link';

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
					$button_selector => 'color: {{VALUE}}',
				],
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
		$settings = $this->get_settings_for_display();

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
			'add_to_cart'       => static::IS_ADD_TO_CART,
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
