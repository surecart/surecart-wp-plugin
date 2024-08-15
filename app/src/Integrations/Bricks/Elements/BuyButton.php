<?php

namespace SureCart\Integrations\Bricks\Elements;

use Bricks\Element;
use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Buy Button element.
 */
class BuyButton extends Element {
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
	public $name = 'surecart-product-buy-button';

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
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Buy Button', 'surecart' );
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
		$text = $this->settings['content'] ?? '';

		if ( empty( $text ) ) {
			$text = $this->settings['add_to_cart'] ? esc_html__( 'Add To Cart', 'surecart' ) : esc_html__( 'Buy Now', 'surecart' );
		}

		if ( $this->is_admin_editor() ) {
			$rendered_attributes = $this->get_block_rendered_attributes();
			$content             = '<a class="wp-block-button__link wp-element-button sc-button__link ' . $rendered_attributes['class'] . '" id="' . $rendered_attributes['id'] . '" >';
			$content            .= '<span class="sc-button__link-text">' . esc_html( $text ) . '</span>';
			$content            .= '</a></div>';

			echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

			return;
		}

		$block_attributes                    = array(
			'text'        => esc_attr( $text ),
			'add_to_cart' => (bool) empty( $this->settings['buy_now'] ?? false ),
		);
		$rendered_attributes                 = $this->get_block_rendered_attributes();
		$block_attributes['buttonClassName'] = $rendered_attributes['class'];
		$block_attributes['buttonAnchor']    = $rendered_attributes['id'];

		echo '<!-- wp:' . $this->block_name . ' ' . ( is_array( $block_attributes ) ? wp_json_encode( $block_attributes, JSON_FORCE_OBJECT ) : '' ) . ' --><!-- /wp:' . $this->block_name . ' -->'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
