<?php

namespace SureCart\Integrations\Bricks\Elements;

use Bricks\Element;
use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Product element.
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
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Add to cart', 'surecart' );
	}

	/**
	 * Set control groups.
	 */
	public function set_control_groups() {
		// $this->control_groups['text'] = [ // Unique group identifier (lowercase, no spaces)
		// 'title' => esc_html__( 'Text', 'bricks' ), // Localized control group title
		// 'tab'   => 'content', // Set to either "content" or "style"
		// ];

		// $this->control_groups['settings'] = [
		// 'title' => esc_html__( 'Settings', 'bricks' ),
		// 'tab'   => 'content',
		// ];
	}

	// Set builder controls
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
		echo $this->html(
			[
				'text'        => $this->settings['content'] ?? 'Add To Cart',
				'add_to_cart' => empty( $this->settings['buy_now'] ?? false ),
			]
		);
	}
}
