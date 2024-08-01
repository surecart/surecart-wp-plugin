<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;
use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Selected Price Scratch Amount element.
 */
class SelectedPriceScratchAmount extends \Bricks\Element {
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
	public $name = 'surecart-product-selected-price-scratch-amount';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-selected-price-scratch-amount';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-money';

	/**
	 * The css selector.
	 *
	 * @var string
	 */
	public $css_selector = '.wp-block-surecart-product-selected-price-scratch-amount';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Selected Price Scratch Amount', 'surecart' );
	}

	/**
	 * Render element.
	 */
	public function render() {
		if ( ! bricks_is_frontend() ) {
			$product       = sc_get_product();
			$scratch_price = $product->initial_price->scratch_display_amount ?? Currency::format( 100, $product->currency ?? 'USD' );
			$output        = '<div ' . $this->render_attributes( '_root' ) . '>';
			$output       .= '<span class="wp-block-surecart-product-selected-price-scratch-amount sc-price__amount">' . $scratch_price . '</span>';
			$output       .= '</div>';

			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}

		$output = '<div ' . $this->render_attributes( '_root' ) . '>' . $this->raw() . '</div>';
		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
