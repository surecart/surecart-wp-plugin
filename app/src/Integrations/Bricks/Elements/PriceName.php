<?php


namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Price Name element.
 */
class PriceName extends \Bricks\Element {
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
	public $name = 'surecart-product-price-name';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/price-name';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-align-left';

	/**
	 * The css selector.
	 *
	 * @var string
	 */
	public $css_selector = '.wp-block-surecart-product-price-name';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Price Name', 'surecart' );
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( ! bricks_is_frontend() ) {
			$initial_price = ( sc_get_product() )->initial_price ?? [ 'name' => esc_html__( 'Price Name', 'surecart' ) ];

			$output  = '<div ' . $this->render_attributes( '_root' ) . '>';
			$output .= '<div class="wp-block-surecart-product-price-name">';
			$output .= '<span class="sc-price-name">' . $initial_price->name . '</span>';
			$output .= '</div>';
			$output .= '</div>';
			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		$output = '<div ' . $this->render_attributes( '_root' ) . '>' . $this->raw() . '</div>';
		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
