<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Quick Add Button widget.
 */
class ProductQuickAddButton extends \Elementor\Widget_Base {
	/**
	 * Default icon.
	 */
	public const DEFAULT_ICON = array(
		'value'   => 'fas fa-plus',
		'library' => 'fa-solid',
	);

	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-quick-add-button';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Quick Add Button', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-plus-square';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'shop', 'button', 'quick' );
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
		return esc_html__( 'Add', 'surecart' );
	}

	/**
	 * Get the style dependencies.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array( 'surecart-wp-buttons', 'surecart-wp-button', 'wp-block-button', 'surecart-product-quick-view-button' );
	}

	/**
	 * Register the widget content settings.
	 *
	 * @return void
	 */
	protected function register_content_settings() {
		$this->start_controls_section(
			'section_design',
			[
				'label' => esc_html__( 'Design', 'surecart' ),
			]
		);

		$this->add_control(
			'label',
			[
				'label'   => esc_html__( 'Button Text', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => $this->get_default_label(),
			]
		);

		$this->add_control(
			'icon_position',
			[
				'label'   => esc_html__( 'Icon Position', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'default' => 'before',
				'options' => [
					'before' => esc_html__( 'Before', 'surecart' ),
					'after'  => esc_html__( 'After', 'surecart' ),
				],
			]
		);

		$this->add_control(
			'quick_view_button_type',
			[
				'label'   => esc_html__( 'Icon & Text', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'default' => 'both',
				'options' => [
					'icon' => esc_html__( 'Icon', 'surecart' ),
					'text' => esc_html__( 'Text', 'surecart' ),
					'both' => esc_html__( 'Both', 'surecart' ),
				],
			]
		);

		$this->add_control(
			'show_on_hover',
			array(
				'label'     => esc_html__( 'Show on Hover', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::SWITCHER,
				'label_on'  => esc_html__( 'Yes', 'surecart' ),
				'label_off' => esc_html__( 'No', 'surecart' ),
				'default'   => 'no',
			)
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_settings',
			[
				'label' => esc_html__( 'Settings', 'surecart' ),
			]
		);

		$this->add_control(
			'direct_add_to_cart',
			array(
				'label'        => esc_html__( 'Direct add to cart', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Yes', 'surecart' ),
				'label_off'    => esc_html__( 'No', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'yes',
			)
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
						'plus',
					],
				],
				'default'          => self::DEFAULT_ICON,
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
		$button_selector      = '{{WRAPPER}} .wp-block-surecart-product-quick-view-button';
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

		$this->add_control(
			'content_align',
			[
				'label'     => esc_html__( 'Content Alignment', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::CHOOSE,
				'options'   => [
					'flex-start' => [
						'title' => esc_html__( 'Start', 'surecart' ),
						'icon'  => 'eicon-h-align-left',
					],
					'center'     => [
						'title' => esc_html__( 'Center', 'surecart' ),
						'icon'  => 'eicon-h-align-center',
					],
					'flex-end'   => [
						'title' => esc_html__( 'End', 'surecart' ),
						'icon'  => 'eicon-h-align-right',
					],
				],
				'default'   => 'flex-start',
				'selectors' => [
					$button_selector => 'justify-content: {{VALUE}};',
				],
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

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'     => 'border',
				'selector' => $button_selector,
			]
		);

		$this->add_control(
			'border_radius',
			array(
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => array(
					$button_selector => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->add_responsive_control(
			'padding',
			[
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'label'      => esc_html__( 'Padding', 'textdomain' ),
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'selectors'  => [
					$button_selector => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'margin',
			[
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'label'      => esc_html__( 'Margin', 'textdomain' ),
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'selectors'  => [
					$button_selector => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
		$settings            = $this->get_settings_for_display();
		$product_id          = get_the_ID();
		$product             = sc_get_product();
		$is_add_to_cart      = ! empty( $settings['direct_add_to_cart'] ) && 'yes' === $settings['direct_add_to_cart'];
		$should_direct_add   = $is_add_to_cart && empty( $product->has_options );
		$show_on_hover_class = 'yes' === $settings['show_on_hover'] ? 'is-style-show-on-hover ' : '';
		$attributes          = array(
			'icon_position'          => $settings['icon_position'] ?? 'before',
			'quick_view_button_type' => $settings['quick_view_button_type'] ?? 'both',
			'label'                  => $settings['label'] ?? $this->get_default_label(),
		);
		$show_icon           = in_array( $attributes['quick_view_button_type'], [ 'icon', 'both' ], true ) && ( ! empty( $settings['icon'] ) || ! empty( $settings['selected_icon']['value'] ) );
		$show_text           = in_array( $attributes['quick_view_button_type'], [ 'text', 'both' ], true );
		$quick_view_link     = add_query_arg( 'product-quick-view', $product_id );
		$is_disabled         = empty( $quick_view_link ) ? 'true' : null;

		if ( $should_direct_add ) {
			$is_disabled = empty( $product->in_stock ) ? 'true' : null;
			$aria_label  = empty( $product->in_stock ) ? __( 'Sold Out', 'surecart' ) : __( 'Add to Cart', 'surecart' );

			$this->add_render_attribute( 'quick-add-button', 'disabled', $is_disabled );
			$this->add_render_attribute( 'quick-add-button', 'aria-label', $aria_label );
			$this->add_render_attribute( 'quick-add-button', 'data-wp-on--click', 'callbacks.handleSubmit' );
			$this->add_render_attribute( 'quick-add-button', 'data-wp-on--keydown', 'callbacks.handleSubmit' );
		} else {
			$this->add_render_attribute(
				'quick-add-button',
				'data-wp-context',
				wp_json_encode(
					[
						'url' => sanitize_url( $quick_view_link ),
					],
					JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
				)
			);
			$this->add_render_attribute( 'quick-add-button', 'aria-label', __( 'Quick Add Product', 'surecart' ) );
			$this->add_render_attribute( 'quick-add-button', 'data-wp-on--click', 'actions.open' );
			$this->add_render_attribute( 'quick-add-button', 'data-wp-on--keydown', 'actions.open' );
			$this->add_render_attribute( 'quick-add-button', 'data-wp-on--mouseenter', 'actions.prefetch' );
			$this->add_render_attribute( 'quick-add-button', 'data-wp-interactive', '{ "namespace": "surecart/product-quick-view" }' );
		}

		$this->add_render_attribute( 'quick-add-button', 'class', 'wp-block-surecart-product-quick-view-button wp-block-button__link sc-button__link elementor-button elementor-button-link elementor-size-sm ' . $show_on_hover_class );
		$this->add_render_attribute( 'quick-add-button', 'data-wp-class--loading', 'state.loading' );
		$this->add_render_attribute( 'quick-add-button', 'data-wp-class--sc-button__link--busy', 'state.loading' );
		$this->add_render_attribute( 'quick-add-button', 'aria-disabled', $is_disabled );

		if ( $show_icon && ! empty( $settings['selected_icon']['value'] ) ) {
			$this->add_render_attribute( 'icon', 'class', 'elementor-button-icon' );
		}

		if ( ! \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			\SureCart::block()->quickView()->render();
		}

		?>
		<div 
			role="button" 
			tabindex="0" 
			<?php echo $this->get_render_attribute_string( 'quick-add-button' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		>
			<span class="sc-spinner" aria-hidden="true"></span>
			<?php if ( $show_icon && 'before' === $attributes['icon_position'] ) : ?>
				<span <?php echo $this->get_render_attribute_string( 'icon' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
					<?php \Elementor\Icons_Manager::render_icon( $settings['selected_icon'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</span>
			<?php endif; ?>
			<?php if ( $show_text ) : ?>
				<span class="sc-button__link-text"><?php echo esc_html( empty( $product->in_stock ) ? __( 'Sold Out', 'surecart' ) : $attributes['label'] ); ?></span>
			<?php endif; ?>
			<?php if ( $show_icon && 'after' === $attributes['icon_position'] ) : ?>
				<span <?php echo $this->get_render_attribute_string( 'icon' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
					<?php \Elementor\Icons_Manager::render_icon( $settings['selected_icon'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</span>
			<?php endif; ?>
		</div>
		<?php
	}
}
