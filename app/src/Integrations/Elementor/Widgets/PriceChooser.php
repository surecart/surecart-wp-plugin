<?php

namespace SureCart\Integrations\Elementor\Widgets;

use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Price Chooser widget.
 */
class PriceChooser extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-price-chooser';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Price Selector', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-price-table';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'price', 'chooser', 'choices' );
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
	 * Get the style dependencies.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array( 'surecart-choice', 'surecart-elementor-container-style', 'surecart-elementor-style' );
	}

	/**
	 * Add content controls.
	 *
	 * @return void
	 */
	protected function add_content_controls() {
		$this->start_controls_section(
			'section_content',
			array(
				'label' => esc_html__( 'Label', 'surecart' ),
			)
		);

		$this->add_control(
			'label',
			array(
				'label'       => esc_html__( 'Label', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::TEXT,
				'description' => esc_html__( 'The label for price choices.', 'surecart' ),
				'default'     => esc_html__( 'Pricing', 'surecart' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Add the price chooser style settings.
	 *
	 * @return void
	 */
	protected function add_price_chooser_style_settings() {
		$selector         = '{{WRAPPER}} .wp-block-surecart-product-price-chooser';
		$selector_label   = '{{WRAPPER}} .wp-block-surecart-product-price-chooser .sc-form-label';
		$selector_choices = '{{WRAPPER}} .wp-block-surecart-product-price-chooser .sc-choices';

		$this->start_controls_section(
			'section_price_chooser_style',
			array(
				'label' => esc_html__( 'Container', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'label_color',
			array(
				'label'     => esc_html__( 'Label Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => array(
					$selector       => 'color: {{VALUE}}',
					$selector_label => 'color: {{VALUE}}',
				),
				'default'   => '#000000',
			)
		);

		$this->add_control(
			'container_type',
			[
				'label'            => esc_html__( 'Container Layout', 'surecart' ),
				'type'             => \Elementor\Controls_Manager::SELECT,
				'default'          => 'grid',
				'options'          => [
					'flex' => esc_html__( 'Flexbox', 'surecart' ),
					'grid' => esc_html__( 'Grid', 'surecart' ),
				],
				'selectors'        => [
					$selector_choices => '--display: {{VALUE}}',
				],
				'separator'        => 'after',
				'editor_available' => true,
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Flex_Container::get_type(),
			[
				'name'           => 'price_chooser_flex',
				'selector'       => $selector_choices,
				'fields_options' => [
					'gap' => [
						'label' => esc_html__( 'Gaps', 'surecart' ),
					],
				],
				'condition'      => [
					'container_type' => [ 'flex' ],
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Grid_Container::get_type(),
			[
				'name'           => 'price_chooser_grid',
				'selector'       => $selector_choices,
				'condition'      => [
					'container_type' => [ 'grid' ],
				],
				'fields_options' => [
					'columns_grid' => [
						'default' => [
							'unit'  => 'fr',
							'size'  => 1,
							'sizes' => [],
						],
					],
					'gaps'         => [
						'default' => [
							'column'   => '15',
							'row'      => '15',
							'isLinked' => true,
							'unit'     => 'px',
						],
					],
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'price_chooser_typography',
				'selector' => $selector_label,
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Add the price choice style settings.
	 *
	 * @return void
	 */
	protected function add_price_choice_style_settings() {
		$selector         = '{{WRAPPER}} .sc-choices .sc-choice';
		$selector_checked = '{{WRAPPER}} .sc-choices .sc-choice.sc-choice--checked';

		$this->start_controls_section(
			'section_price_choice_style',
			array(
				'label' => esc_html__( 'Price Choice', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'price_choice_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					$selector => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'price_choice_background_color',
			[
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$selector => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'price_choice_highlight_color',
			[
				'label'     => esc_html__( 'Highlight Border', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					$selector_checked => 'border-color: {{VALUE}}!important; box-shadow: 0 0 0 1px {{VALUE}} !important;',
				],
			]
		);

		$this->add_control(
			'price_choice_highlight_text_color',
			[
				'label'     => esc_html__( 'Highlight Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					$selector_checked => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'price_choice_typography',
				'global'   => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Typography::TYPOGRAPHY_PRIMARY,
				],
				'selector' => $selector,
			]
		);

		$this->add_control(
			'price_choice_padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					$selector => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'price_choice_margin',
			[
				'label'      => esc_html__( 'Margin', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					$selector => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'      => 'price_choice_border',
				'selector'  => $selector,
				'separator' => 'before',
			]
		);

		$this->add_responsive_control(
			'price_choice_border_radius',
			array(
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'selectors'  => array(
					$selector => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Add price name style settings.
	 *
	 * @return void
	 */
	protected function add_price_name_style_settings() {
		$selector = '{{WRAPPER}} .sc-choices .sc-choice .wp-block-surecart-price-name';

		$this->start_controls_section(
			'section_price_name_style',
			array(
				'label' => esc_html__( 'Price Name', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'price_name_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => array(
					$selector => 'color: {{VALUE}}',
				),
			)
		);

		$this->add_control(
			'price_name_background_color',
			array(
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => array(
					$selector => 'background-color: {{VALUE}}',
				),
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'     => 'price_name_typography',
				'selector' => $selector,
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Register the price amount style settings.
	 *
	 * @return void
	 */
	protected function add_price_amount_style_settings() {
		$selector = '{{WRAPPER}} .sc-choices .sc-choice .wp-block-surecart-price-amount';

		$this->start_controls_section(
			'section_price_amount_style',
			array(
				'label' => esc_html__( 'Price Amount', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'price_amount_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => array(
					$selector => 'color: {{VALUE}}',
				),
			)
		);

		$this->add_control(
			'price_amount_background_color',
			array(
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => array(
					$selector => 'background-color: {{VALUE}}',
				),
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'     => 'price_amount_typography',
				'selector' => $selector,
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Register the price trial style settings.
	 *
	 * @return void
	 */
	protected function add_price_trial_style_settings() {
		$selector = '{{WRAPPER}} .sc-choices .sc-choice .wp-block-surecart-price-trial';

		$this->start_controls_section(
			'section_price_trial_style',
			array(
				'label' => esc_html__( 'Price Trial', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'price_trial_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => array(
					$selector => 'color: {{VALUE}}',
				),
				'default'   => '#8a8a8a',
			)
		);

		$this->add_control(
			'price_trial_background_color',
			array(
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => array(
					$selector => 'background-color: {{VALUE}}',
				),
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'           => 'price_trial_typography',
				'selector'       => $selector,
				'fields_options' => [
					'typography' => [ 'default' => 'yes' ],
					'font_size'  => [
						'default' => [
							'unit' => 'px',
							'size' => 12,
						],
					],
				],
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Register the price setup fee style settings.
	 *
	 * @return void
	 */
	protected function add_price_setup_fee_style_settings() {
		$selector = '{{WRAPPER}} .sc-choices .sc-choice .wp-block-surecart-price-setup-fee';

		$this->start_controls_section(
			'section_price_setup_fee_style',
			array(
				'label' => esc_html__( 'Price Setup Fee', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'price_setup_fee_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => array(
					$selector => 'color: {{VALUE}}',
				),
				'default'   => '#8a8a8a',
			)
		);

		$this->add_control(
			'price_setup_fee_background_color',
			array(
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => array(
					$selector => 'background-color: {{VALUE}}',
				),
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'           => 'price_setup_fee_typography',
				'selector'       => $selector,
				'fields_options' => [
					'typography' => [ 'default' => 'yes' ],
					'font_size'  => [
						'default' => [
							'unit' => 'px',
							'size' => 12,
						],
					],
				],
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget style settings
	 *
	 * @return void
	 */
	protected function register_style_settings() {
		$this->add_price_chooser_style_settings();
		$this->add_price_choice_style_settings();
		$this->add_price_name_style_settings();
		$this->add_price_amount_style_settings();
		$this->add_price_trial_style_settings();
		$this->add_price_setup_fee_style_settings();
	}

	/**
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->add_content_controls();
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
			<div class="wp-block-surecart-product-price-chooser">
				<label class="sc-form-label"><?php echo esc_html( $settings['label'] ); ?></label>
				<div class="sc-choices">
					<div class="sc-choice wp-block-surecart-product-price-choice-template sc-choice--checked is-layout-flex" style="align-items: center;">
						<span class="wp-block-surecart-price-name"><?php echo esc_html__( 'Subscribe & Save', 'surecart' ); ?></span>
						<div class="is-layout-flex" style="flex-direction:column;align-items:flex-end;gap:0;">
							<?php // translators: %s is the price. ?>
							<span class="wp-block-surecart-price-amount"><?php echo esc_html( sprintf( __( '%s /mo', 'surecart' ), Currency::format( 800 ) ) ); ?></span>
							<?php // translators: %d is the number of days. ?>
							<span class="wp-block-surecart-price-trial"><?php echo esc_html( sprintf( __( 'Starting in %d days', 'surecart' ), 15 ) ); ?></span>
							<?php // translators: %s is the setup fee. ?>
							<span class="wp-block-surecart-price-setup-fee"><?php echo esc_html( sprintf( __( '%s Setup fee', 'surecart' ), Currency::format( 1200 ) ) ); ?></span>
						</div>
					</div>
					<div class="sc-choice wp-block-surecart-product-price-choice-template is-layout-flex" style="align-items: center;">
						<span class="wp-block-surecart-price-name"><?php echo esc_html__( 'One Time', 'surecart' ); ?></span>
						<div class="is-layout-flex" style="flex-direction: column;align-items:flex-end;gap:0;">
							<?php // translators: %s is the price. ?>
							<span class="wp-block-surecart-price-amount"><?php echo esc_html( Currency::format( 1000 ) ); ?></span>
							<?php // translators: %s is the setup fee. ?>
							<span class="wp-block-surecart-price-setup-fee"><?php echo esc_html( sprintf( __( '%s Setup fee', 'surecart' ), Currency::format( 200 ) ) ); ?></span>
						</div>
					</div>
				</div>
			</div>
			<?php
			return;
		}

		$attributes = array(
			'label' => $settings['label'] ?? '',
		);

		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
		<!-- wp:surecart/product-price-chooser <?php echo wp_json_encode( $attributes ); ?> -->
		<!-- wp:surecart/product-price-choice-template {"layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap","orientation":"horizontal"}} -->
		<!-- wp:surecart/price-name {"style":{"layout":{"selfStretch":"fixed","flexSize":"50%"},"typography":{"fontStyle":"normal","fontWeight":"600"}}} /-->
		<!-- wp:group {"style":{"spacing":{"blockGap":"0px"},"layout":{"selfStretch":"fixed","flexSize":"50%"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"right"}} -->
		<div class="wp-block-group">
			<!-- wp:surecart/price-amount /-->
			<!-- wp:surecart/price-trial /-->
			<!-- wp:surecart/price-setup-fee /-->
		</div>
		<!-- /wp:group -->
		<!-- /wp:surecart/product-price-choice-template -->
		<!-- /wp:surecart/product-price-chooser -->
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
		<div class="wp-block-surecart-product-price-chooser">
			<label class="sc-form-label">{{{ settings.label}}}</label>
			<div class="sc-choices">
				<div class="sc-choice wp-block-surecart-product-price-choice-template sc-choice--checked is-layout-flex" style="align-items: center;">
					<span class="wp-block-surecart-price-name"><?php echo esc_html__( 'Subscribe & Save', 'surecart' ); ?></span>
					<div class="is-layout-flex" style="flex-direction:column;align-items:flex-end;gap:0;">
						<?php // translators: %s is the price. ?>
						<span class="wp-block-surecart-price-amount"><?php echo esc_html( sprintf( __( '%s /mo', 'surecart' ), Currency::format( 800 ) ) ); ?></span>
						<?php // translators: %d is the number of days. ?>
						<span class="wp-block-surecart-price-trial"><?php echo esc_html( sprintf( __( 'Starting in %d days', 'surecart' ), 15 ) ); ?></span>
						<?php // translators: %s is the setup fee. ?>
						<span class="wp-block-surecart-price-setup-fee"><?php echo esc_html( sprintf( __( '%s Setup fee', 'surecart' ), Currency::format( 1200 ) ) ); ?></span>
					</div>
				</div>
				<div class="sc-choice wp-block-surecart-product-price-choice-template is-layout-flex" style="align-items: center;">
					<span class="wp-block-surecart-price-name"><?php echo esc_html__( 'One Time', 'surecart' ); ?></span>
					<div class="is-layout-flex" style="flex-direction: column;align-items:flex-end;gap:0;">
						<?php // translators: %s is the price. ?>
						<span class="wp-block-surecart-price-amount"><?php echo esc_html( Currency::format( 1000 ) ); ?></span>
						<?php // translators: %s is the setup fee. ?>
						<span class="wp-block-surecart-price-setup-fee"><?php echo esc_html( sprintf( __( '%s Setup fee', 'surecart' ), Currency::format( 200 ) ) ); ?></span>
					</div>
				</div>
			</div>
		</div>
		<?php
	}
}
