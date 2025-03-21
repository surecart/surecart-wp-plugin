<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Cart Menu Icon element.
 */
class CartMenuIcon extends \Bricks\Element {
	use ConvertsBlocks; // we have to use a trait since we can't extend the surecart class.

	/**
	 * Element category.
	 *
	 * @var string
	 */
	public $category = 'SureCart Elements';

	/**
	 * Element name.
	 *
	 * @var string
	 */
	public $name = 'surecart-cart-icon';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/cart-menu-icon-button';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-bag';

	/**
	 * Cart icon.
	 *
	 * @var string
	 */
	public $cart_icon = '';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Cart Toggle Icon', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['cart_icon'] = [
			'label'   => esc_html__( 'Icon', 'surecart' ),
			'type'    => 'icon',
			'default' => null,
		];

		$this->controls['cart_menu_always_shown'] = [
			'label'   => esc_html__( 'Always show cart menu', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$settings = $this->settings;

		$this->set_attribute( '_root', 'class', 'wp-block-surecart-cart-menu-icon-button' );

		if ( ! empty( $settings['size'] ) ) {
			$this->set_attribute( '_root', 'class', $settings['size'] );
		}

		// Outline.
		if ( isset( $settings['outline'] ) ) {
			$this->set_attribute( '_root', 'class', 'outline' );
		}

		if ( ! empty( $settings['style'] ) ) {
			// Outline (border).
			if ( isset( $settings['outline'] ) ) {
				$this->set_attribute( '_root', 'class', "bricks-color-{$settings['style']}" );
			} else { // Background (= default).
				$this->set_attribute( '_root', 'class', "bricks-background-{$settings['style']}" );
			}
		}

		$cart_menu_always_shown = ! empty( $settings['cart_menu_always_shown'] ) ? true : false;

		$this->cart_icon = ! empty( $settings['cart_icon']['icon'] ) ? self::render_icon( $settings['cart_icon'], [ 'icon' ] ) : self::render_icon(
			[
				'icon' => 'ti-bag',
			],
			[ 'icon' ]
		);

		// Filter cart icon.
		add_filter( 'sc_cart_menu_icon', [ $this, 'render_bricks_icon' ] );

		if ( $this->is_admin_editor() ) {
			$content  = '<div class="sc-cart-icon" style="font-size: var(--sc-cart-icon-size, 1.1em); cursor: pointer; position: relative;" aria-label="' . esc_attr__( 'Open cart', 'surecart' ) . '">';
			$content .= $this->cart_icon;
			$content .= '<span class="sc-cart-count" style="box-sizing: border-box; position: absolute; inset: -12px -16px auto auto; text-align: center; font-size: 10px; font-weight: bold; border-radius: var(--sc-cart-icon-counter-border-radius, 9999px); color: var(--sc-cart-icon-counter-color, var(--sc-color-primary-text, var(--sc-color-white))); background: var(--sc-cart-icon-counter-background, var(--sc-color-primary-500)); box-shadow: var(--sc-cart-icon-box-shadow, var(--sc-shadow-x-large)); padding: 2px 6px; line-height: 14px; min-width: 14px; z-index: 1;">2</span>';
			$content .= '</div>';

			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$content,
				'',
				'a'
			);
		} else {
			echo $this->html( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				[
					'cart_menu_always_shown' => $cart_menu_always_shown, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				]
			);
		}

		// Remove cart icon filter after rendering.
		remove_filter( 'sc_cart_menu_icon', [ $this, 'render_bricks_icon' ] );
	}

	/**
	 * Render Bricks icon.
	 *
	 * @param string $icon Icon.
	 *
	 * @return string
	 */
	public function render_bricks_icon( $icon ): string {
		return $this->cart_icon ?? $icon;
	}
}
