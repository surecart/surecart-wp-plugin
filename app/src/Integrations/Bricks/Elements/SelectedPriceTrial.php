<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;
use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Selected Price Trial element.
 */
class SelectedPriceTrial extends \Bricks\Element {
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
	public $name = 'surecart-product-selected-price-trial';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-selected-price-trial';

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
		return esc_html__( 'Selected Price Trial', 'surecart' );
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( $this->is_admin_editor() ) {
			$product    = sc_get_product();
			$trial_text = ! empty( $product->initial_price->trial_text ) ? $product->initial_price->trial_text : esc_html__( 'Starting in 7 days.', 'surecart' );

			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$trial_text,
				'wp-block-surecart-product-selected-price-trial',
				'span'
			);
			return;
		}

		echo $this->raw(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
