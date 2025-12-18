<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Add to cart / buy now button widget.
 */
class AddToCartButton extends \Elementor\Widget_Base {
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
		return array( 'surecart', 'cart', 'button', 'buy', 'submit' );
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
	 * Get the default button label.
	 *
	 * @return string
	 */
	protected function get_default_label(): string {
		return esc_html__( 'Add To Cart', 'surecart' );
	}

	/**
	 * Get the style dependencies.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array( 'surecart-spinner', 'surecart-wp-button' );
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

		$this->add_control(
			'show_sticky_purchase_button',
			[
				'label'       => esc_html__( 'Show sticky button', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SELECT,
				'default'     => 'never',
				'description' => esc_html__( 'Show a sticky purchase button when this button is out of view', 'surecart' ),
				'options'     => [
					'never'    => esc_html__( 'Never', 'surecart' ),
					'in_stock' => esc_html__( 'In stock', 'surecart' ),
					'always'   => esc_html__( 'Always', 'surecart' ),
				],
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

		$this->start_controls_section(
			'section_icon_settings',
			[
				'label' => esc_html__( 'Icon', 'surecart' ),
			]
		);

		$this->add_control(
			'selected_icon',
			[
				'label'            => esc_html__( 'Icon', 'surecart' ),
				'type'             => \Elementor\Controls_Manager::ICONS,
				'fa4compatibility' => 'icon',
				'skin'             => 'inline',
				'label_block'      => false,
				'recommended'      => [
					'fa-solid' => [
						'shopping-bag',
						'cart-arrow-down',
						'cart-plus',
						'shopping-cart',
						'shopping-basket',
					],
				],
			]
		);

		$this->add_control(
			'icon_align',
			[
				'label'                => esc_html__( 'Icon Position', 'surecart' ),
				'type'                 => \Elementor\Controls_Manager::CHOOSE,
				'default'              => is_rtl() ? 'row-reverse' : 'row',
				'options'              => [
					'row'         => [
						'title' => esc_html__( 'Start', 'surecart' ),
						'icon'  => 'eicon-h-align-left',
					],
					'row-reverse' => [
						'title' => esc_html__( 'End', 'surecart' ),
						'icon'  => 'eicon-h-align-right',
					],
				],
				'selectors_dictionary' => [
					'left'  => is_rtl() ? 'row-reverse' : 'row',
					'right' => is_rtl() ? 'row' : 'row-reverse',
				],
				'selectors'            => [
					'{{WRAPPER}} .elementor-button-content-wrapper' => 'flex-direction: {{VALUE}};',
					'{{WRAPPER}} .sc-button__link' => 'flex-direction: {{VALUE}};',
				],
				'condition'            => [
					'selected_icon[value]!' => '',
				],
			]
		);

		$this->add_control(
			'icon_indent',
			[
				'label'      => esc_html__( 'Icon Spacing', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', 'rem' ],
				'range'      => [
					'px'  => [
						'max' => 50,
					],
					'em'  => [
						'max' => 5,
					],
					'rem' => [
						'max' => 5,
					],
				],
				'default'    => [
					'size' => 10,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .elementor-button-content-wrapper' => 'gap: {{SIZE}}{{UNIT}};',
				],
				'condition'  => [
					'selected_icon[value]!' => '',
				],
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
		$button_selector      = '{{WRAPPER}} .wp-block-button__link';
		$button_icon_selector = '{{WRAPPER}} .elementor-button-icon svg';

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
				'name'           => 'button_typography',
				'global'         => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Typography::TYPOGRAPHY_PRIMARY,
				],
				'fields_options' => [
					'typography'  => [ 'default' => 'yes' ],
					'line_height' => [
						'default' => [
							'unit' => 'px',
							'size' => 16,
						],
					],
				],
				'selector'       => $button_selector,
			]
		);

		$this->start_controls_tabs( 'button_colors' );

		$this->start_controls_tab(
			'button_colors_normal',
			[
				'label' => esc_html__( 'Normal', 'surecart' ),
			]
		);

		$this->add_control(
			'button_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$button_selector      => 'color: {{VALUE}}',
					$button_icon_selector => 'fill: {{VALUE}}',
				],
				'default'   => '#ffffff',
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

		$this->end_controls_tab();

		$this->start_controls_tab(
			'button_colors_hover',
			[
				'label' => esc_html__( 'Hover', 'surecart' ),
			]
		);

		$this->add_control(
			'button_hover_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$button_selector . ':hover' => 'color: {{VALUE}}!important;',
					$button_selector . ':hover .elementor-button-icon svg' => 'fill: {{VALUE}}!important; color: {{VALUE}}!important;',
				],
			]
		);

		$this->add_control(
			'button_hover_background_color',
			[
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$button_selector . ':hover' => 'background-color: {{VALUE}}',
				],
			]
		);

		$this->add_control(
			'hover_animation',
			[
				'label' => esc_html__( 'Hover Animation', 'surecart' ),
				'type'  => \Elementor\Controls_Manager::HOVER_ANIMATION,
			]
		);

		$this->end_controls_tab();

		$this->end_controls_tabs();

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

		$args = [
			'section_condition'              => [],
			'alignment_default'              => '',
			'alignment_control_prefix_class' => 'elementor%s-align-',
			'content_alignment_default'      => '',
		];

		$this->add_responsive_control(
			'align',
			[
				'label'        => esc_html__( 'Position', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::CHOOSE,
				'options'      => [
					'left'    => [
						'title' => esc_html__( 'Left', 'surecart' ),
						'icon'  => 'eicon-h-align-left',
					],
					'center'  => [
						'title' => esc_html__( 'Center', 'surecart' ),
						'icon'  => 'eicon-h-align-center',
					],
					'right'   => [
						'title' => esc_html__( 'Right', 'surecart' ),
						'icon'  => 'eicon-h-align-right',
					],
					'justify' => [
						'title' => esc_html__( 'Stretch', 'surecart' ),
						'icon'  => 'eicon-h-align-stretch',
					],
				],
				'prefix_class' => $args['alignment_control_prefix_class'],
				'default'      => $args['alignment_default'],
				'condition'    => $args['section_condition'],
			]
		);

		$start = is_rtl() ? 'right' : 'left';
		$end   = is_rtl() ? 'left' : 'right';

		$this->add_responsive_control(
			'content_align',
			[
				'label'     => esc_html__( 'Alignment', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::CHOOSE,
				'options'   => [
					'start'         => [
						'title' => esc_html__( 'Start', 'surecart' ),
						'icon'  => "eicon-text-align-{$start}",
					],
					'center'        => [
						'title' => esc_html__( 'Center', 'surecart' ),
						'icon'  => 'eicon-text-align-center',
					],
					'end'           => [
						'title' => esc_html__( 'End', 'surecart' ),
						'icon'  => "eicon-text-align-{$end}",
					],
					'space-between' => [
						'title' => esc_html__( 'Space between', 'surecart' ),
						'icon'  => 'eicon-text-align-justify',
					],
				],
				'default'   => $args['content_alignment_default'],
				'selectors' => [
					'{{WRAPPER}} .elementor-button .elementor-button-content-wrapper' => 'justify-content: {{VALUE}};',
				],
				'condition' => array_merge( $args['section_condition'], [ 'align' => 'justify' ] ),
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
		$settings       = $this->get_settings_for_display();
		$is_add_to_cart = ! isset( $settings['buy_button_type'] ) || 'yes' !== $settings['buy_button_type'];

		$this->add_render_attribute( 'wrapper', 'class', 'wp-block-button__link wp-block-surecart-product-elementor-cart-button wp-element-button sc-button__link elementor-button elementor-button-link elementor-size-sm' );
		$this->add_render_attribute( 'button', 'class', 'elementor-button' );

		if ( ! empty( $settings['selected_icon']['value'] ) ) {
			$this->add_render_attribute( 'icon', 'class', 'elementor-button-icon' );
		}

		if ( ! empty( $settings['hover_animation'] ) ) {
			$this->add_render_attribute( 'wrapper', 'class', 'elementor-animation-' . $settings['hover_animation'] );
		}

		$this->add_render_attribute(
			[
				'content-wrapper' => [
					'class' => 'elementor-button-content-wrapper',
				],
				'text'            => [
					'class' => 'elementor-button-text',
				],
			]
		);

		// Interactivity context.
		$this->add_render_attribute(
			'content-wrapper',
			'data-wp-context',
			wp_json_encode(
				array(
					'checkoutUrl'     => esc_url( \SureCart::pages()->url( 'checkout' ) ),
					'buttonText'      => $settings['button_text'] ?? ( $is_add_to_cart ? __( 'Add to Cart', 'surecart' ) : __( 'Buy Now', 'surecart' ) ),
					'outOfStockText'  => $settings['button_out_of_stock_text'] ?? esc_attr( __( 'Sold Out', 'surecart' ) ),
					'unavailableText' => $settings['button_unavailable_text'] ?? esc_attr( __( 'Unavailable For Purchase', 'surecart' ) ),
					'addToCart'       => $is_add_to_cart,
				),
				JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
			)
		);

		$this->add_render_attribute( 'wrapper', 'data-wp-bind--disabled', 'state.isUnavailable' );
		$this->add_render_attribute( 'wrapper', 'data-wp-class--sc-button__link--busy', 'context.busy' );
		if ( ! $is_add_to_cart ) {
			$this->add_render_attribute( 'wrapper', 'data-wp-on--click', 'callbacks.redirectToCheckout' );
		}

		ob_start();
		?>
		<button
			<?php if ( ! empty( $settings['show_sticky_purchase_button'] ) && 'never' !== $settings['show_sticky_purchase_button'] ) : ?>
				<?php $this->add_render_attribute( 'wrapper', 'data-wp-on-async-window--scroll', 'surecart/sticky-purchase::actions.toggleVisibility' ); ?>
				<?php $this->add_render_attribute( 'wrapper', 'data-wp-on-async-window--resize', 'surecart/sticky-purchase::actions.toggleVisibility' ); ?>
			<?php endif; ?>

			<?php echo $this->get_render_attribute_string( 'wrapper' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<span <?php echo $this->get_render_attribute_string( 'content-wrapper' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<?php
			if ( ! empty( $settings['icon'] ) || ! empty( $settings['selected_icon']['value'] ) ) :
				$this->add_render_attribute( 'icon', 'class', 'elementor-button-icon' );
				?>
				<span <?php echo $this->get_render_attribute_string( 'icon' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
					<?php \Elementor\Icons_Manager::render_icon( $settings['selected_icon'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</span>
			<?php endif; ?>

			<?php if ( isset( $settings['button_text'] ) ) : ?>
				<?php if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) : ?>
					<?php echo trim( $settings['button_text'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<?php else : ?>
					<span class="sc-spinner" aria-hidden="false"></span>
					<span class="sc-button__link-text" data-wp-text="state.buttonText"></span>
				<?php endif; ?>
			<?php endif; ?>
			</span>
		</button>

		<?php
		$output = ob_get_clean();
		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

		// Render the sticky purchase button.
		if ( ! is_admin() ) { // Elementor injects into the content area so we only render it in the frontend.
			\SureCart::render( 'blocks/sticky-purchase', [ 'settings' => $settings ] );
		}
	}

	/**
	 * Render the widget output on the editor.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<#
		if ( '' === settings.button_text && '' === settings.selected_icon.value ) {
			return;
		}

		view.addRenderAttribute( 'wrapper', 'class', 'wp-block-button__link wp-element-button sc-button__link elementor-button elementor-button-link elementor-size-sm' );
		view.addRenderAttribute( 'button', 'class', 'elementor-button' );

		if ( '' !== settings.hover_animation ) {
			view.addRenderAttribute( 'wrapper', 'class', 'elementor-animation-' + settings.hover_animation );
		}

		if ( settings.icon || settings.selected_icon ) {
			view.addRenderAttribute( 'icon', 'class', 'elementor-button-icon' );
		}

		view.addRenderAttribute( 'text', 'class', 'elementor-button-text' );
		view.addRenderAttribute( 'content-wrapper', 'class', 'elementor-button-content-wrapper' );
		var iconHTML = elementor.helpers.renderIcon( view, settings.selected_icon, { 'aria-hidden': true }, 'i' , 'object' );
		#>
		<button {{{ view.getRenderAttributeString( 'wrapper' ) }}}>
			<span {{{ view.getRenderAttributeString( 'content-wrapper' ) }}}>
				<# if ( settings.icon || settings.selected_icon ) { #>
				<span {{{ view.getRenderAttributeString( 'icon' ) }}}>
					<# if ( ( ! settings.icon ) && iconHTML.rendered ) { #>
						{{{ iconHTML.value }}}
					<# } else { #>
						<i class="{{ settings.icon }}" aria-hidden="true"></i>
					<# } #>
				</span>
				<# } #>
				<# if ( settings.button_text ) { #>
				<span {{{ view.getRenderAttributeString( 'text' ) }}}>{{{ settings.button_text }}}</span>
				<# } #>
			</span>
		</button>
		<?php
	}
}
