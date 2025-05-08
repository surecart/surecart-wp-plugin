<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Sale Badge widget.
 */
class SaleBadge extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-sales-badge';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Sale Badge', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-tags';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'sale', 'badge' );
	}

	/**
	 * Get the style dependencies.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array( 'surecart-tag' );
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
			'section_sale_badge',
			[
				'label' => esc_html__( 'Sale Badge', 'surecart' ),
			]
		);

		$this->add_control(
			'text',
			[
				'label'       => esc_html__( 'Text', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::TEXT,
				'placeholder' => esc_html__( 'Sale', 'surecart' ),
				'default'     => esc_html__( 'Sale', 'surecart' ),
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
			'section_collection_tag_style',
			array(
				'label' => esc_html__( 'Badge Style', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'badge_text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'default'   => '#ffffff',
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-sale-badge' => 'color: {{VALUE}}',
				],
			)
		);

		$this->add_control(
			'badge_background_color',
			array(
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-sale-badge' => 'background-color: {{VALUE}}',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'badge_typography',
				'global'   => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Typography::TYPOGRAPHY_PRIMARY,
				],
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-sale-badge',
			]
		);

		$this->add_responsive_control(
			'badge_alignment',
			[
				'label'     => esc_html__( 'Alignment', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::CHOOSE,
				'options'   => [
					'left'   => [
						'title' => esc_html__( 'Left', 'surecart' ),
						'icon'  => 'eicon-text-align-left',
					],
					'center' => [
						'title' => esc_html__( 'Center', 'surecart' ),
						'icon'  => 'eicon-text-align-center',
					],
					'right'  => [
						'title' => esc_html__( 'Right', 'surecart' ),
						'icon'  => 'eicon-text-align-right',
					],
				],
				'default'   => 'center',
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-sale-badge' => 'justify-content: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'badge_padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-sale-badge' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'badge_margin',
			[
				'label'      => esc_html__( 'Margin', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-sale-badge' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'badge_width',
			[
				'label'     => esc_html__( 'Width', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::SELECT,
				'options'   => [
					'fit-content' => esc_html__( 'Fit', 'surecart' ),
					'100%'        => esc_html__( 'Fill', 'surecart' ),
					'fixed'       => esc_html__( 'Fixed', 'surecart' ),
				],
				'default'   => 'fit-content',
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-sale-badge' => 'width: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'badge_fixed_width',
			[
				'label'      => esc_html__( 'Specify a fixed width', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', '%' ],
				'condition'  => [
					'badge_width' => 'fixed',
				],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-sale-badge' => 'width: {{SIZE}}{{UNIT}};',
				],
				'default'    => [
					'size' => 100,
					'unit' => 'px',
				],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 1000,
					],
					'em' => [
						'min'  => 0,
						'step' => 0.1,
						'max'  => 10,
					],
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'      => 'border',
				'selector'  => '{{WRAPPER}} .wp-block-surecart-product-sale-badge',
				'separator' => 'before',
			]
		);

		$this->add_responsive_control(
			'border_radius',
			[
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'global'     => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-sale-badge' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
		$settings = $this->get_settings_for_display();

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			?>
			<div class="sc-tag sc-tag--primary wp-block-surecart-product-sale-badge">
				<?php echo esc_html( $settings['text'] ); ?>
			</div>
			<?php
			return;
		}

		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-sale-badge {"text" : "<?php echo esc_attr( $settings['text'] ); ?>", "style":{"border":{"radius":"15px"},"typography":{"fontSize":"12px","lineHeight":"2.1"},"layout":{"selfStretch":"fit","flexSize":null}}} /-->
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
		<div class="sc-tag sc-tag--primary wp-block-surecart-product-sale-badge">
			{{{ settings.text }}}
		</div>
		<?php
	}
}
