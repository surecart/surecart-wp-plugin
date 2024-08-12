<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;
use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Selected Price Fees element.
 */
class SelectedPriceFees extends \Bricks\Element {
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
	public $name = 'surecart-product-selected-price-fees';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-selected-price-fees';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-money';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Selected Price Fees', 'surecart' );
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( $this->is_admin_editor() ) {
			$product         = sc_get_product();
			$setup_fees_text = $product->initial_price->setup_fee_text ?? '';

			if ( empty( $setup_fees_text ) ) {
				// translators: %s: Setup Fee.
				$setup_fees_text = sprintf( __( '%s Setup Fee', 'surecart' ), Currency::format( 100, $product->currency ?? 'USD' ) );
			}

			$output  = '<div ' . $this->render_attributes( '_root' ) . '>';
			$output .= '<span class="wp-block-surecart-product-selected-price-trial">' . $setup_fees_text . '</span>';
			$output .= '</div>';

			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}

		echo $this->raw(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
