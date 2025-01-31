<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * CartIcon element.
 */
class CartIcon extends \Bricks\Element {
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
	public $icon = 'ti-shopping-cart';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Cart Icon', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['cart_icon'] = [
			'label' => esc_html__( 'Icon', 'surecart' ),
			'type'  => 'icon',
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

		$bricks_icon = self::render_icon( $settings['cart_icon'] ?? 'shopping-bag' );

		add_filter(
			'sc_cart_menu_icon',
			function ( $icon ) use ( $bricks_icon ) {
				return $bricks_icon ?? $icon;
			}
		);

		// Don't render if the cart is disabled.
		if ( ! \SureCart::cart()->isCartEnabled() ) {
			return;
		}

		if ( $this->is_admin_editor() ) {
			$bricks_icon = empty( $bricks_icon ) ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
				<line x1="3" y1="6" x2="21" y2="6"></line>
				<path d="M16 10a4 4 0 0 1-8 0"></path>
			</svg>' : $bricks_icon;
			$content     = '<div class="sc-cart-icon" aria-label="' . esc_attr__( 'Open cart', 'surecart' ) . '">' . $bricks_icon . '</div>';
			$content    .= '<span class="sc-cart-count">2</span>';

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
	}
}
