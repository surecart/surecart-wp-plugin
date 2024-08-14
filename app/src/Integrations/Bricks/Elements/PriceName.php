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
		if ( $this->is_admin_editor() ) {
			$product = sc_get_product();
			$name    = $product->initial_price->name ?? __( 'Price Name', 'surecart' );
			$content = '<span class="sc-price-name">' . $name . '</span>';

			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$content,
				'wp-block-surecart-product-price-name',
			);

			return;
		}

		echo $this->raw(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
