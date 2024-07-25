<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product element.
 */
class SelectedPriceAmount extends \Bricks\Element {
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
	public $name = 'surecart-product-selected-price-amount';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-selected-price-amount';

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
		return esc_html__( 'Selected Price Amount', 'surecart' );
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		// Bricks does not process directives so we need to fake it here.
		if ( ! bricks_is_frontend() ) {
			$product = sc_get_product();
			echo "<div {$this->render_attributes( '_root' )}>";
			echo $product->initial_price->display_amount ?? '$50';
			echo '</div>';
			return;
		}
		echo $this->html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
