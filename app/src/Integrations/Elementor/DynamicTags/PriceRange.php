<?php

namespace SureCart\Integrations\Elementor\DynamicTags;

use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Price Range Dynamic Tag.
 */
class PriceRange extends \Elementor\Core\DynamicTags\Tag {

	/**
	 * Get the tag name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-price-range';
	}

	/**
	 * Get the tag title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product price range', 'surecart' );
	}

	/**
	 * Get the tag group.
	 *
	 * @return string
	 */
	public function get_group() {
		return 'surecart-product';
	}

	/**
	 * Get the tag categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return [
			\Elementor\Modules\DynamicTags\Module::TEXT_CATEGORY,
		];
	}

	/**
	 * Render the tag output.
	 */
	public function render() {
		$product = sc_get_product();
		if ( ! $product ) {
			echo esc_html( Currency::format( 1000 ) . ' - ' . Currency::format( 2000 ) );
			return;
		}

		echo esc_html( $product->range_display_amount );
	}
}
