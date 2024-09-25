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
		return 'eicon-plus';
	}

	/**
	 * Get style dependencies.
	 */
	public function get_style_depends() {
		return [ 'surecart-form-control', 'surecart-input-group' ];
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
	 * Register the widget style settings.
	 *
	 * @return void
	 */
	protected function register_style_settings() {
		$this->start_controls_section(
			'section_amount_style',
			array(
				'label' => esc_html__( 'Input', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'amount_text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => array(
					'.wp-block-surecart-product-selected-price-ad-hoc-amount' => 'color: {{VALUE}}',
				),
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'      => 'amount_typography',
				'label'     => esc_html__( 'Typography', 'surecart' ),
				'selectors' => array(
					'.wp-block-surecart-product-selected-price-ad-hoc-amount' => 'font-size: {{SIZE}}{{UNIT}}; font-family: {{FAMILY}}; font-weight: {{WEIGHT}}; font-style: {{STYLE}}; text-transform: {{TEXT_TRANSFORM}}; line-height: {{LINE_HEIGHT}};',
					'.wp-block-surecart-product-selected-price-ad-hoc-amount .sc-form-label' => 'font-size: {{SIZE}}{{UNIT}}; font-family: {{FAMILY}}; font-weight: {{WEIGHT}}; font-style: {{STYLE}}; text-transform: {{TEXT_TRANSFORM}}; line-height: {{LINE_HEIGHT}};',
				),
			)
		);

		$this->add_responsive_control(
			'amount_width',
			array(
				'label'      => esc_html__( 'Width', 'elementor' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => array(
					'.wp-block-surecart-product-selected-price-ad-hoc-amount' => 'width: {{SIZE}}{{UNIT}};',
				),
				'default'    => [
					'size' => 100,
					'unit' => '%',
				],
			)
		);

		$this->add_control(
			'amount_border_radius',
			array(
				'label'      => esc_html__( 'Border Radius', 'elementor' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => array(
					'.wp-block-surecart-product-selected-price-ad-hoc-amount .sc-form-control' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
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
