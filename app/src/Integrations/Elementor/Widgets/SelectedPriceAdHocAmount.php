<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use SureCart\Models\Account as AccountModel;

/**
 * Selected Price Ad Hoc Amount widget.
 */
class SelectedPriceAdHocAmount extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-selected-price-ad-hoc-amount';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Custom Amount', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-pencil';
	}

	/**
	 * Get style dependencies.
	 */
	public function get_style_depends() {
		return array( 'surecart-form-control', 'surecart-input-group' );
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'custom', 'amount' );
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
	protected function register_content_settings() {
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
				'placeholder' => esc_html__( 'Enter an amount', 'surecart' ),
				'default'     => esc_html__( 'Enter an amount', 'surecart' ),
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget label style settings.
	 *
	 * @return void
	 */
	protected function register_label_style_settings() {
		$amount_selector = '{{WRAPPER}} .wp-block-surecart-product-selected-price-ad-hoc-amount';

		$this->start_controls_section(
			'section_label_style',
			array(
				'label' => esc_html__( 'Label', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'label_text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$amount_selector                     => 'color: {{VALUE}}',
					$amount_selector . ' .sc-form-label' => 'color: {{VALUE}}',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'     => 'label_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => $amount_selector . ' label',
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget input style settings.
	 *
	 * @return void
	 */
	protected function register_input_style_settings() {
		$input_group_selector = '{{WRAPPER}} .wp-block-surecart-product-selected-price-ad-hoc-amount .sc-input-group';

		$this->start_controls_section(
			'section_amount_style',
			array(
				'label' => esc_html__( 'Input', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'     => 'selected_amount_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => $input_group_selector . '>*',
			)
		);

		$this->add_responsive_control(
			'selected_amount_width',
			array(
				'label'      => esc_html__( 'Width', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => array(
					$input_group_selector => 'width: {{SIZE}}{{UNIT}};',
				),
				'default'    => [
					'size' => 100,
					'unit' => '%',
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
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'     => 'selected_amount_border',
				'selector' => $input_group_selector,
			]
		);

		$this->add_responsive_control(
			'selected_amount_border_radius',
			[
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'selectors'  => [
					$input_group_selector => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
		$this->register_label_style_settings();
		$this->register_input_style_settings();
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
			<div class="wp-block-surecart-product-selected-price-ad-hoc-amount">
				<label for="sc-product-custom-amount" class="sc-form-label">
					<?php echo esc_html( $settings['label'] ); ?>
				</label>

				<div class="sc-input-group">
					<span class="sc-input-group-text" id="basic-addon1"><?php echo esc_html( strtoupper( ( AccountModel::find() )->currency ?? '$' ) ); ?></span>
					<input
						class="sc-form-control"
						id="sc-product-custom-amount"
						type="number"
						step="0.01"
					/>
				</div>
			<?php
			return;
		}

		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-selected-price-ad-hoc-amount { "label" : "<?php echo esc_attr( $settings['label'] ); ?>"} /-->
		</div>
		<?php
	}

	/**
	 * Render the widget output on the editor.
	 *
	 * @return void
	 */
	protected function content_template() {
		$currency = strtoupper( ( AccountModel::find() )->currency ?? '$' );
		?>
		<div  class="wp-block-surecart-product-selected-price-ad-hoc-amount">
			<label for="sc-product-custom-amount" class="sc-form-label">
				{{{ settings.label }}}
			</label>

			<div class="sc-input-group">
				<span class="sc-input-group-text" id="basic-addon1"><?php echo esc_html( $currency ); ?></span>

				<input
					class="sc-form-control"
					id="sc-product-custom-amount"
					type="number"
					step="0.01"
				/>
			</div>
		</div>
		<?php
	}
}
