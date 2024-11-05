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
		return [ 'surecart-elementor' ];
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
				'default'   => '#686868',
			]
		);

		$this->end_controls_section();

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
				'default'   => '#686868',
			]
		);

		$this->end_controls_section();

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
				'default'   => '#686868',
			]
		);

		$this->end_controls_section();

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
				'default'   => '#ffffff',
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

		$this->end_controls_section();

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
				'default'   => '#686868',
			]
		);

		$this->end_controls_section();

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
				'default'   => '#686868',
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
					<!-- wp:surecart/product-selected-price-scratch-amount {"style":{"typography":{"textDecoration":"line-through","fontSize":"24px","lineHeight":"1.5"},"color":{"text":"#686868"},"elements":{"link":{"color":{"text":"#686868"}}}}} /-->

					<!-- wp:surecart/product-selected-price-amount {"style":{"typography":{"fontSize":"24px","lineHeight":"1.5"}}} /-->

					<!-- wp:surecart/product-selected-price-interval {"style":{"typography":{"lineHeight":"2"}}} /-->

					<!-- wp:surecart/product-sale-badge {"style":{"border":{"radius":"15px"},"typography":{"fontSize":"12px","lineHeight":"2.1"},"layout":{"selfStretch":"fit","flexSize":null},"elements":{"link":{"color":{"text":"var:preset|color|white"}}}},"textColor":"white"} /-->
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
			<div style="display: flex; justify-content:flex-start; gap: 5px;">
				<span tabindex="0" class="wp-block-surecart-product-selected-price-scratch-amount" style="font-size: 24px; line-height: 1.5; text-decoration: line-through;">
					<?php echo esc_html( Currency::format( 20 ) ); ?>
				</span>
				<span tabindex="0" class="wp-block-surecart-product-selected-price-amount" style="font-size: 24px; line-height: 1.5;">
					<?php echo esc_html( Currency::format( 15 ) ); ?>
				</span>
				<span tabindex="0" class="wp-block-surecart-product-selected-price-interval" style="line-height: 2;">/ <?php echo esc_html__( 'mo', 'surecart' ); ?></span>
				<span tabindex="0" class="wp-block-surecart-product-sale-badge" style="min-width: 1px; padding: 2px 10px; border-radius: 15px; font-size: 12px; max-width: 50px; align-self: center">
					<?php echo esc_html__( 'Sale', 'surecart' ); ?>
				</span>
			</div>
			<div style="display: flex; flex-wrap: wrap; gap: 20px;">
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
