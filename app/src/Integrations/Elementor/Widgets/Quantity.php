<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


/**
 * Quantity widget.
 */
class Quantity extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-quantity';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Quantity', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-plus';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'quantity', 'cart' );
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
				'label' => esc_html__( 'Content', 'surecart' ),
			]
		);

		$this->add_control(
			'label',
			[
				'label'       => esc_html__( 'Label', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::TEXT,
				'placeholder' => esc_html__( 'Quantity', 'surecart' ),
				'default'     => esc_html__( 'Quantity', 'surecart' ),
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
			'section_quantity_label_style',
			array(
				'label' => esc_html__( 'Label', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'quantity_text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => array(
					'.wp-block-surecart-product-quantity' => 'color: {{VALUE}}',
				),
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'     => 'quantity_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => '.wp-block-surecart-product-quantity',
			)
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_quantity_input_style',
			array(
				'label' => esc_html__( 'Input', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_responsive_control(
			'quantity_width',
			array(
				'label'      => esc_html__( 'Width', 'elementor' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => array(
					'.wp-block-surecart-product-quantity .sc-quantity-selector' => 'width: {{SIZE}}{{UNIT}};',
				),
			)
		);

		$this->add_control(
			'quantity_border_radius',
			array(
				'label'      => esc_html__( 'Border Radius', 'elementor' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => array(
					'.wp-block-surecart-product-quantity .sc-quantity-selector' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
			$attributes = array( 'label' => esc_attr( $settings['label'] ) );

			echo do_blocks( '<!-- wp:surecart/product-quantity ' . wp_json_encode( $attributes ) . '  /-->' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}

		?>
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-quantity { "label" : "<?php echo esc_attr( $settings['label'] ); ?>"} /-->
		</div>
		<?php
	}

	/**
	 * Render the widget output on the editor.
	 *
	 * @return void
	 */
	protected function content_template() {
		echo do_blocks( '<!-- wp:surecart/product-quantity { "label" : "{{{ settings.label }}}" } /-->' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
