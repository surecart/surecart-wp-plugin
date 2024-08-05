<?php
namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Price Trial element.
 */
class PriceTrial extends \Bricks\Element {
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
	public $name = 'surecart-product-price-trial';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-price-trial';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-time';

	/**
	 * The css selector.
	 *
	 * @var string
	 */
	public $css_selector = '.wp-block-surecart-product-price-trial';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Price Trial', 'surecart' );
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( ! bricks_is_frontend() ) {
			$price = ( sc_get_product() )->initial_price ?? [
				'trial_text' => esc_html__( 'Starting in 15 days', 'surecart' ),
			];

			$output  = '<div ' . $this->render_attributes( '_root' ) . '>';
			$output .= '<div class="wp-block-surecart-product-price-trial">';
			$output .= '<span class="sc-price-name">' . $price->trial_text . '</span>';
			$output .= '</div>';
			$output .= '</div>';
			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		$output = '<div ' . $this->render_attributes( '_root' ) . '>' . $this->raw() . '</div>';
		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
