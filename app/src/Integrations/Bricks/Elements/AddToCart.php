<?php

namespace SureCart\Integrations\Bricks\Elements;

use Bricks\Element;
use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Add to cart button element.
 */
class AddToCart extends Element {
	use ConvertsBlocks; // we have to use a trait since we can't extend the bricks class.

	/**
	 * Element category.
	 *
	 * @var string
	 */
	public $category = 'surecart';

	/**
	 * Element name.
	 *
	 * @var string
	 */
	public $name = 'surecart-add-to-cart';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-buy-button';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-shopping-cart';

	/**
	 * The css selector.
	 *
	 * @var string
	 */
	public $css_selector = '.wp-block-surecart-product-buy-button .sc-button__link';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Add to cart', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['content'] = [
			'tab'     => 'content',
			'label'   => esc_html__( 'Button Text', 'surecart' ),
			'type'    => 'text',
			'default' => esc_html__( 'Add To Cart', 'surecart' ),
		];

		$this->controls['buy_now'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Go Directly To Checkout', 'surecart' ),
			'type'        => 'checkbox',
			'description' => esc_html__( 'Bypass adding to cart and go directly to the checkout.', 'surecart' ),
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( bricks_is_builder() ) {
			$content = wp_kses_post( $this->settings['content'] ?? esc_html__( 'Add To Cart', 'surecart' ) );
			echo <<<HTML
				<div {$this->render_attributes( '_root' )}>
					<div class="wp-block-button has-custom-width wp-block-button__width-100 wp-block-surecart-product-buy-button">
						<a class="wp-block-button__link wp-element-button sc-button__link">
							<span class="sc-button__link-text">{$content}</span>
						</a>
					</div>
				</div>
			HTML;
			return;
		}

		echo "<div {$this->render_attributes( '_root' )}>" . $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			[
				'text'        => wp_kses_post( $this->settings['content'] ?? esc_html__( 'Add To Cart', 'surecart' ) ),
				'add_to_cart' => (bool) empty( $this->settings['buy_now'] ?? false ),
			]
		) . '</div>';
	}
}
