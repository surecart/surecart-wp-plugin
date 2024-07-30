<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Quantity element.
 */
class Quantity extends \Bricks\Element {
	use ConvertsBlocks; // we have to use a trait since we can't extend the surecart class.

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
	public $name = 'surecart-product-quantity';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-quantity';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-layout-slider-alt';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Quantity', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['quantity'] = [
			'type'    => 'number',
			'label'   => esc_html__( 'Quantity', 'surecart' ),
			'default' => 1,
			'min'     => 1,
			'max'     => 100,
			'step'    => 1,
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		echo $this->raw(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
