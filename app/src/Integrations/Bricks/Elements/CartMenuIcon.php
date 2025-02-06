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
			'default' => [
				'icon' => 'ti-bag',
			],
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

		$form      = \SureCart::cart()->getForm();
		$form_mode = \SureCart::cart()->getMode();

		// Stop if no form or mode found as for deletion.
		if ( empty( $form->ID ) || empty( $form_mode ) ) {
			return;
		}

		$cart_menu_always_shown = ! empty( $settings['cart_menu_always_shown'] ) ? true : false;

		// Interactivity context.
		$this->set_attribute(
			'_root',
			'data-wp-context',
			wp_json_encode(
				array(
					'formId'              => intval( $form->ID ),
					'mode'                => esc_attr( $form_mode ),
					'cartMenuAlwaysShown' => $cart_menu_always_shown,
				),
				JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
			)
		);

		$this->cart_icon = self::render_icon(
			$settings['cart_icon'] ?? [
				'icon' => 'ti-bag',
			]
		);

		// Filter cart icon.
		add_filter( 'sc_cart_menu_icon', array( $this, 'render_bricks_icon' ) );

		// Don't render if the cart is disabled.
		if ( ! \SureCart::cart()->isCartEnabled() ) {
			return;
		}

		if ( $this->is_admin_editor() ) {
			$content  = '<div class="sc-cart-icon" aria-label="' . esc_attr__( 'Open cart', 'surecart' ) . '">';
			$content .= $this->cart_icon;
			$content .= '<span class="sc-cart-count">2</span>';
			$content .= '</div>';

			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$content,
				'',
				'a'
			);
			return;
		}

		echo $this->html( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			[
				'cart_menu_always_shown' => $cart_menu_always_shown, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			]
		);

		// Remove cart icon filter.
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
