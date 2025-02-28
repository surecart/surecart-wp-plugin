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
				'default'     => [
					'value'   => 'fas fa-shopping-cart',
					'library' => 'fa-solid',
				],
				'recommended' => [
					'fa-solid' => [
						'cart-arrow-down',
						'cart-plus',
						'shopping-cart',
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
				'default'      => 'no',
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
		$this->cart_icon        = ! empty( $settings['cart_icon']['value'] ) ? \Elementor\Icons_Manager::try_get_icon_html( $settings['cart_icon'], [ 'aria-hidden' => 'true' ] ) : null;

		$attributes = array(
			'cart_icon'              => $this->cart_icon,
			'cart_menu_always_shown' => $cart_menu_always_shown,
		);

		// Filter cart icon.
		add_filter( 'sc_cart_menu_icon', [ $this, 'render_cart_icon' ] );

		// if editor.
		if ( \Elementor\Plugin::instance()->editor->is_edit_mode() ) {
			$this->cart_icon = $this->cart_icon ?? \SureCart::svg()->get( 'shopping-bag' ); // Fall back to default icon for editor.
			?>
			<div class="sc-cart-icon" style="font-size: var(--sc-cart-icon-size, 1.1em); cursor: pointer; position: relative;" aria-label="<?php echo esc_attr__( 'Open cart', 'surecart' ); ?>">
				<?php echo $this->cart_icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<span class="sc-cart-count" style="box-sizing: border-box; position: absolute; inset: -12px -16px auto auto; text-align: center; font-size: 10px; font-weight: bold; border-radius: var(--sc-cart-icon-counter-border-radius, 9999px); color: var(--sc-cart-icon-counter-color, var(--sc-color-primary-text, var(--sc-color-white))); background: var(--sc-cart-icon-counter-background, var(--sc-color-primary-500)); box-shadow: var(--sc-cart-icon-box-shadow, var(--sc-shadow-x-large)); padding: 2px 6px; line-height: 14px; min-width: 14px; z-index: 1;">2</span>
			</div>
			<?php
		} else {
			echo do_blocks( '<!-- wp:surecart/cart-menu-icon-button ' . wp_json_encode( $attributes ) . ' /-->' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		// Remove filter.
		remove_filter( 'sc_cart_menu_icon', [ $this, 'render_cart_icon' ] );
	}

	/**
	 * Render the cart icon.
	 *
	 * @param string $icon Icon.
	 *
	 * @return string
	 */
	public function render_cart_icon( $icon ): string {
		return $this->cart_icon ?? $icon;
	}
}
