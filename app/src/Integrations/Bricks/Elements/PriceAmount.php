<?php
namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;
use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Price Amount element.
 */
class PriceAmount extends \Bricks\Element {
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
	public $name = 'surecart-product-price-amount';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/price-amount';

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
	public $css_selector = '.wp-block-surecart-product-price-amount';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Price Amount', 'surecart' );
	}

	/**
	 * Render the element.
	 *
	 * @return void
	 */
	public function render() {
		if ( $this->is_admin_editor() ) {
			$price          = ( sc_get_product() )->initial_price ?? [
				'amount'              => Currency::format( 200 ),
				'short_interval_text' => '/mo',
			];
			$display_amount = sprintf( esc_attr__( '%1$s %2$s', 'surecart' ), $price->display_amount, $price->short_interval_text );

			$output  = '<div ' . $this->render_attributes( '_root' ) . '>';
			$output .= '<div class="wp-block-surecart-product-price-amount">';
			$output .= '<span class="sc-price-name">' . $display_amount . '</span>';
			$output .= '</div>';
			$output .= '</div>';

			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		echo $this->raw(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
