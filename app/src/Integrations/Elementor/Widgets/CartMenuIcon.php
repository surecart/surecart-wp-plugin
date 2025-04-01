<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Cart menu icon widget.
 */
class CartMenuIcon extends \Elementor\Widget_Base {
	/**
	 * Default cart icon.
	 */
	public const DEFAULT_CART_ICON = array(
		'value'   => 'fas fa-shopping-bag',
		'library' => 'fa-solid',
	);

	/**
	 * Cart icon.
	 *
	 * @var string
	 */
	public $cart_icon = '';

	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-cart-icon';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Cart Toggle Icon', 'surecart' );
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
		return array( 'surecart', 'cart', 'product', 'menu', 'toggle' );
	}

	/**
	 * Is the content dynamic?
	 *
	 * @return bool
	 */
	protected function is_dynamic_content(): bool {
		return false;
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
	 * Register the content settings.
	 *
	 * @return void
	 */
	private function register_content_settings() {
		$this->start_controls_section(
			'content_section',
			array(
				'label' => esc_html__( 'Content', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'cart_icon',
			array(
				'label'       => esc_html__( 'Icon', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::ICONS,
				'skin'        => 'inline',
				'label_block' => false,
				'default'     => self::DEFAULT_CART_ICON,
				'recommended' => [
					'fa-solid' => [
						'shopping-bag',
						'cart-arrow-down',
						'cart-plus',
						'shopping-cart',
						'shopping-basket',
					],
				],
			)
		);

		$this->add_control(
			'cart_menu_always_shown',
			array(
				'label'        => esc_html__( 'Always Show Cart Menu', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Yes', 'surecart' ),
				'label_off'    => esc_html__( 'No', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'yes',
			)
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
			'section_style_icon',
			[
				'label' => esc_html__( 'Icon', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->start_controls_tabs( 'icon_colors' );

		$this->start_controls_tab(
			'icon_colors_normal',
			[
				'label' => esc_html__( 'Normal', 'surecart' ),
			]
		);

		$this->add_control(
			'primary_color',
			[
				'label'     => esc_html__( 'Primary Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'default'   => '',
				'selectors' => [
					'{{WRAPPER}} .sc-cart-icon'     => 'color: {{VALUE}};',
					'{{WRAPPER}} .sc-cart-icon svg' => 'fill: {{VALUE}};',
				],
			]
		);

		$this->end_controls_tab();

		$this->start_controls_tab(
			'icon_colors_hover',
			[
				'label' => esc_html__( 'Hover', 'surecart' ),
			]
		);

		$this->add_control(
			'hover_primary_color',
			[
				'label'     => esc_html__( 'Primary Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'default'   => '',
				'selectors' => [
					'{{WRAPPER}} .sc-cart-icon:hover'     => 'color: {{VALUE}};',
					'{{WRAPPER}} .sc-cart-icon:hover svg' => 'fill: {{VALUE}};',
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

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'icon_typography',
				'global'   => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Typography::TYPOGRAPHY_PRIMARY,
				],
				'selector' => '{{WRAPPER}} .sc-cart-icon',
			]
		);

		$this->add_responsive_control(
			'size',
			[
				'label'      => esc_html__( 'Size', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%', 'em', 'rem', 'vw', 'custom' ],
				'range'      => [
					'px' => [
						'min' => 6,
						'max' => 300,
					],
				],
				'default'    => [
					'size' => 20,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .sc-cart-icon'     => 'font-size: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .sc-cart-icon svg' => 'height: {{SIZE}}{{UNIT}};',
				],
				'separator'  => 'before',
			]
		);

		$this->add_responsive_control(
			'width',
			[
				'label'      => esc_html__( 'Width', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%', 'em', 'rem', 'vw', 'custom' ],
				'range'      => [
					'px' => [
						'min' => 6,
						'max' => 300,
					],
				],
				'default'    => [
					'size' => 20,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .sc-cart-icon' => 'width: {{SIZE}}{{UNIT}};',
				],
				'separator'  => 'before',
			]
		);

		$this->add_control(
			'fit_to_size',
			[
				'label'       => esc_html__( 'Fit to Size', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SWITCHER,
				'description' => 'Avoid gaps around icons when width and height aren\'t equal',
				'label_off'   => esc_html__( 'Off', 'surecart' ),
				'label_on'    => esc_html__( 'On', 'surecart' ),
				'condition'   => [
					'cart_icon[library]' => 'svg',
				],
				'selectors'   => [
					'{{WRAPPER}} .sc-cart-icon svg' => 'width: auto;',
				],
			]
		);

		$this->add_control(
			'icon_padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'selectors'  => [
					'{{WRAPPER}} .sc-cart-icon' => 'padding: {{SIZE}}{{UNIT}};',
				],
				'range'      => [
					'px'  => [
						'max' => 50,
					],
					'em'  => [
						'min' => 0,
						'max' => 5,
					],
					'rem' => [
						'min' => 0,
						'max' => 5,
					],
				],
			]
		);

		$this->add_responsive_control(
			'rotate',
			[
				'label'          => esc_html__( 'Rotate', 'surecart' ),
				'type'           => \Elementor\Controls_Manager::SLIDER,
				'size_units'     => [ 'deg', 'grad', 'rad', 'turn', 'custom' ],
				'default'        => [
					'unit' => 'deg',
				],
				'tablet_default' => [
					'unit' => 'deg',
				],
				'mobile_default' => [
					'unit' => 'deg',
				],
				'selectors'      => [
					'{{WRAPPER}} .sc-cart-icon i, {{WRAPPER}} .sc-cart-icon svg' => 'transform: rotate({{SIZE}}{{UNIT}});',
				],
			]
		);

		$this->add_control(
			'border_width',
			[
				'label'      => esc_html__( 'Border Width', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em', 'rem', 'vw', 'custom' ],
				'selectors'  => [
					'{{WRAPPER}} .sc-cart-icon' => 'border-width: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'border_radius',
			[
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'selectors'  => [
					'{{WRAPPER}} .sc-cart-icon' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
	 * Render the widget.
	 *
	 * @return void
	 */
	protected function render(): void {
		$settings               = $this->get_settings_for_display();
		$cart_menu_always_shown = ! empty( $settings['cart_menu_always_shown'] ) && 'yes' === $settings['cart_menu_always_shown'] ? true : false;
		$has_icon               = ! empty( $settings['cart_icon']['value'] );
		$this->cart_icon        = \Elementor\Icons_Manager::try_get_icon_html( $has_icon ? $settings['cart_icon'] : self::DEFAULT_CART_ICON, [ 'aria-hidden' => 'true' ] );

		$attributes = array(
			'cart_menu_always_shown' => $cart_menu_always_shown,
			'custom_icon'            => $this->cart_icon,
		);

		if ( ! empty( $settings['hover_animation'] ) ) {
			$this->add_render_attribute( 'icon-wrapper', 'class', 'sc-cart-icon elementor-animation-' . $settings['hover_animation'] );
		}
		?>

		<div <?php echo $this->get_render_attribute_string( 'icon-wrapper' ); ?> class="sc-cart-icon" style="font-size: var(--sc-cart-icon-size, 1.1em); cursor: pointer; position: relative;" aria-label="<?php echo esc_attr__( 'Open cart', 'surecart' ); ?>"> <?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php
			if ( \Elementor\Plugin::instance()->editor->is_edit_mode() ) :
				?>
				<?php echo $this->cart_icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<span class="sc-cart-count" style="box-sizing: border-box; position: absolute; inset: -12px -16px auto auto; text-align: center; font-size: 10px; font-weight: bold; border-radius: var(--sc-cart-icon-counter-border-radius, 9999px); color: var(--sc-cart-icon-counter-color, var(--sc-color-primary-text, var(--sc-color-white))); background: var(--sc-cart-icon-counter-background, var(--sc-color-primary-500)); box-shadow: var(--sc-cart-icon-box-shadow, var(--sc-shadow-x-large)); padding: 2px 6px; line-height: 14px; min-width: 14px; z-index: 1;">2</span>
			<?php else : ?>
				<?php
				echo do_blocks( '<!-- wp:surecart/cart-menu-icon-button ' . wp_json_encode( $attributes ) . ' /-->' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				endif;
			?>
		</div>
		<?php
	}
}
