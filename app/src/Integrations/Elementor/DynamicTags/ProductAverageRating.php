<?php

namespace SureCart\Integrations\Elementor\DynamicTags;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Average Rating Dynamic Tag.
 */
class ProductAverageRating extends \Elementor\Core\DynamicTags\Tag {
	/**
	 * Get the tag name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-review-average-rating';
	}

	/**
	 * Get the tag title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Average Rating', 'surecart' );
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
		return [ \Elementor\Modules\DynamicTags\Module::TEXT_CATEGORY, \Elementor\Modules\DynamicTags\Module::NUMBER_CATEGORY ];
	}

	/**
	 * Render the tag output.
	 *
	 * @return void
	 */
	public function render() {
		$product = sc_get_product();

		if ( empty( $product ) ) {
			echo '4.3';
			return;
		}

		echo esc_html( $product->average_stars ?? '0' );
	}
}
