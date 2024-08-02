<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Selected Price Interval element.
 */
class SelectedPriceInterval extends \Bricks\Element {
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
	public $name = 'surecart-product-selected-price-interval';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-selected-price-interval';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-time';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Selected Price Interval', 'surecart' );
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( ! bricks_is_frontend() ) {
			$product  = sc_get_product();
			$interval = ! empty( $product->initial_price->short_interval_text ) ? $product->initial_price->short_interval_text : '/ day (20 payments)';
			$output   = '<div ' . $this->render_attributes( '_root' ) . '>';
			$output  .= '<span class="wp-block-surecart-product-selected-price-scratch-amount sc-price__amount">' . $interval . '</span>';
			$output  .= '</div>';

			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}

		$output = '<div ' . $this->render_attributes( '_root' ) . '>' . $this->raw() . '</div>';
		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
