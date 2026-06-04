<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bundle Items widget.
 */
class BundleItems extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-bundle-items';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Bundle Items', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-product-related';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'bundle', 'bundle items', 'bundles', 'product' );
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
		return array( 'surecart-product-bundle-items-style', 'surecart-bundle-item-template-style', 'surecart-product-variants', 'surecart-pill' );
	}

	/**
	 * Register the widget content settings.
	 *
	 * @return void
	 */
	private function register_content_settings() {
		$this->start_controls_section(
			'section_bundle_items_content',
			[
				'label' => esc_html__( 'Bundle Items', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
			]
		);

		$this->add_control(
			'variant_name_separator',
			[
				'label'       => esc_html__( 'Variant Name Separator', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::TEXT,
				'default'     => ' – ',
				'description' => esc_html__( 'Shown between the product name and the variant option name.', 'surecart' ),
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
		$list_selector          = '{{WRAPPER}} .sc-bundle-items__list';
		$row_selector           = '{{WRAPPER}} .sc-bundle-item__row';
		$product_name_selector  = '{{WRAPPER}} .sc-bundle-item__product-name';
		$variant_name_selector  = '{{WRAPPER}} .sc-bundle-item__variant-name';
		$quantity_selector      = '{{WRAPPER}} .sc-bundle-item__qty';
		$pill_wrapper_selector  = '{{WRAPPER}} .sc-pill-option__wrapper';
		$pill_selector          = '{{WRAPPER}} .sc-pill-option__wrapper .wp-block-surecart-bundle-item-variant-pill';
		$pill_selected_selector = '{{WRAPPER}} .sc-pill-option__wrapper .wp-block-surecart-bundle-item-variant-pill.sc-pill-option__button--selected';

		$this->start_controls_section(
			'section_bundle_items_layout_style',
			[
				'label' => esc_html__( 'Layout', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_responsive_control(
			'bundle_items_gap',
			[
				'label'       => esc_html__( 'Items Gap', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SLIDER,
				'size_units'  => [ 'px', 'em', '%' ],
				'description' => esc_html__( 'Space between each bundle item.', 'surecart' ),
				'default'     => [
					'size' => 16,
					'unit' => 'px',
				],
				'selectors'   => [
					$list_selector => 'gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'bundle_item_row_gap',
			[
				'label'       => esc_html__( 'Row Gap', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SLIDER,
				'size_units'  => [ 'px', 'em', '%' ],
				'description' => esc_html__( 'Space between the item label and its options.', 'surecart' ),
				'selectors'   => [
					$row_selector => 'gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_bundle_product_name_style',
			[
				'label' => esc_html__( 'Product Name', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'product_name_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$product_name_selector => 'color: {{VALUE}}',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'product_name_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => $product_name_selector,
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_bundle_variant_name_style',
			[
				'label' => esc_html__( 'Variant Name', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'variant_name_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$variant_name_selector => 'color: {{VALUE}}',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'variant_name_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => $variant_name_selector,
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_bundle_quantity_style',
			[
				'label' => esc_html__( 'Quantity', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'quantity_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$quantity_selector => 'color: {{VALUE}}',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'quantity_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => $quantity_selector,
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_bundle_variant_pill_style',
			[
				'label' => esc_html__( 'Variant Pill', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
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
					$pill_wrapper_selector => 'gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'pill_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$pill_selector . ':not(.sc-pill-option__button--selected)' => 'color: {{VALUE}} !important',
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
					$pill_selector . ':not(.sc-pill-option__button--selected)' => 'background-color: {{VALUE}} !important',
				],
			]
		);

		$this->add_control(
			'pill_highlight_text_color',
			[
				'label'     => esc_html__( 'Highlight Text', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$pill_selected_selector => 'color: {{VALUE}} !important',
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
					$pill_selected_selector => 'background-color: {{VALUE}} !important',
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
					$pill_selected_selector => 'border-color: {{VALUE}} !important',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'pill_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => $pill_selector,
			]
		);

		$this->add_responsive_control(
			'pill_padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					$pill_selector => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'      => 'pill_border',
				'selector'  => $pill_selector,
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
					$pill_selector => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$settings = $this->get_settings_for_display();

			$this->render_preview( $settings['variant_name_separator'] ?? ' – ' );
			return;
		}

		// If product is not a bundle, return.
		if ( empty( sc_get_product()->bundle_items->data ?? [] ) ) {
			return;
		}

		$settings = $this->get_settings_for_display();

		$pill_attributes = array(
			'highlight_text'       => $settings['pill_highlight_text_color'] ?? '',
			'highlight_background' => $settings['pill_highlight_background_color'] ?? '',
			'highlight_border'     => $settings['pill_highlight_border_color'] ?? '',
		);

		$variant_name_attributes = array(
			'separator' => $settings['variant_name_separator'] ?? ' – ',
		);

		$this->add_render_attribute( 'wrapper', 'class', 'wp-block-surecart-product-bundle-items__wrapper' );
		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
		<!-- wp:surecart/product-bundle-items -->
		<!-- wp:surecart/bundle-item-template {"layout":{"type":"flex","orientation":"vertical"}} -->
		<!-- wp:group {"style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"left"}} -->
		<div class="wp-block-group"><!-- wp:surecart/bundle-product-name /-->
		<!-- wp:surecart/bundle-variant-name <?php echo $this->encode_block_attributes( $variant_name_attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> /-->
		<!-- wp:surecart/bundle-item-quantity /--></div>
		<!-- /wp:group -->
		<!-- wp:surecart/bundle-item-variant -->
		<!-- wp:surecart/bundle-item-variant-pill <?php echo $this->encode_block_attributes( $pill_attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> /-->
		<!-- /wp:surecart/bundle-item-variant -->
		<!-- /wp:surecart/bundle-item-template -->
		<!-- /wp:surecart/product-bundle-items -->
		</div>
		<?php
	}

	/**
	 * Encode block attributes for use inside a block comment delimiter.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string
	 */
	private function encode_block_attributes( $attributes ) {
		// Escape "--" so user-entered values can't break the HTML comment.
		return str_replace( '--', '\\u002d\\u002d', wp_json_encode( $attributes ) );
	}

	/**
	 * Render the editor preview with PHP values.
	 *
	 * Used for server-side editor renders. Live preview updates use the
	 * JS bindings in content_template() instead.
	 *
	 * @param string $separator The variant name separator.
	 *
	 * @return void
	 */
	private function render_preview( $separator ) {
		?>
			<div class="wp-block-surecart-product-bundle-items__wrapper">
				<div class="wp-block-surecart-product-bundle-items sc-bundle-items">
					<ul class="sc-bundle-items__list">
						<li class="sc-bundle-items__item">
							<div class="wp-block-surecart-bundle-item-template sc-bundle-item">
								<div class="sc-bundle-item__row">
									<div style="display: flex; gap: 4px; align-items: baseline;">
										<span class="sc-bundle-item__product-name"><?php echo esc_html__( 'T-Shirt', 'surecart' ); ?></span>
										<span class="sc-bundle-item__variant-name"><?php echo esc_html( $separator ) . esc_html__( 'Size', 'surecart' ); ?></span>
										<span class="sc-bundle-item__qty"><?php echo esc_html__( '× 2', 'surecart' ); ?></span>
									</div>
									<div class="sc-pill-option__wrapper">
										<div class="sc-pill-option__button wp-block-surecart-bundle-item-variant-pill sc-pill-option__button--selected"><?php echo esc_html__( 'Small', 'surecart' ); ?></div>
										<div class="sc-pill-option__button wp-block-surecart-bundle-item-variant-pill"><?php echo esc_html__( 'Medium', 'surecart' ); ?></div>
										<div class="sc-pill-option__button wp-block-surecart-bundle-item-variant-pill"><?php echo esc_html__( 'Large', 'surecart' ); ?></div>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		<?php
	}

	/**
	 * Render the widget output on the editor.
	 *
	 * This is a JS (Underscore) template — `{{ }}` / `<# #>` bindings make the
	 * preview update instantly when content controls change.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
			<div class="wp-block-surecart-product-bundle-items__wrapper">
				<div class="wp-block-surecart-product-bundle-items sc-bundle-items">
					<ul class="sc-bundle-items__list">
						<li class="sc-bundle-items__item">
							<div class="wp-block-surecart-bundle-item-template sc-bundle-item">
								<div class="sc-bundle-item__row">
									<div style="display: flex; gap: 4px; align-items: baseline;">
										<span class="sc-bundle-item__product-name"><?php echo esc_html__( 'T-Shirt', 'surecart' ); ?></span>
										<span class="sc-bundle-item__variant-name">{{ settings.variant_name_separator }}<?php echo esc_html__( 'Size', 'surecart' ); ?></span>
										<span class="sc-bundle-item__qty"><?php echo esc_html__( '× 2', 'surecart' ); ?></span>
									</div>
									<div class="sc-pill-option__wrapper">
										<div class="sc-pill-option__button wp-block-surecart-bundle-item-variant-pill sc-pill-option__button--selected"><?php echo esc_html__( 'Small', 'surecart' ); ?></div>
										<div class="sc-pill-option__button wp-block-surecart-bundle-item-variant-pill"><?php echo esc_html__( 'Medium', 'surecart' ); ?></div>
										<div class="sc-pill-option__button wp-block-surecart-bundle-item-variant-pill"><?php echo esc_html__( 'Large', 'surecart' ); ?></div>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		<?php
	}
}
