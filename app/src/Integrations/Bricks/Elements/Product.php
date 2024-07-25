<?php

namespace SureCart\Integrations\Bricks\Elements;

use Bricks\Element;
use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product element.
 */
class Product extends Element {
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
	public $name = 'surecart-product-page';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-page';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-shopping-cart';

	/**
	 * This is nestable.
	 *
	 * @var string
	 */
	public $nestable = true;

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product', 'surecart' );
	}

	/**
	 * Template for the product.
	 *
	 * @return string
	 */
	public function get_nestable_item() {
		return [
			[
				'name' => 'surecart-product-media',
			],
			[
				'name' => 'post-title',
			],
		];
	}

	public function get_nestable_children() {
		return $this->get_nestable_item();
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		echo $this->html( '', \Bricks\Frontend::render_children( $this ) );
	}
}
