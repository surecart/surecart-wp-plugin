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
	 * The constructor.
	 *
	 * @param array $element Element data.
	 *
	 * @return void
	 */
	public function __construct( $element = null ) {
		$element['settings']['_typography']['text-decoration'] = 'line-through';
		parent::__construct( $element );
	}

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
		if ( $this->is_admin_editor() ) {
			$product       = sc_get_product();
			$scratch_price = ! empty( $product->initial_price->scratch_display_amount ) ? $product->initial_price->scratch_display_amount : Currency::format( 100, $product->currency ?? 'USD' );

			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$scratch_price,
				'wp-block-surecart-product-selected-price-scratch-amount sc-price__amount',
				'span'
			);

			return;
		}

		echo $this->raw(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
