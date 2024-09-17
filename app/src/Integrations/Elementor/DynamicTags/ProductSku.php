<?php

namespace SureCart\Integrations\Elementor\DynamicTags;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product SKU Dynamic Tag.
 */
class ProductSku extends \Elementor\Core\DynamicTags\Tag {
	/**
	 * Get the tag name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-sku';
	}

	/**
	 * Get the tag title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product SKU', 'surecart' );
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
		return [ \Elementor\Modules\DynamicTags\Module::TEXT_CATEGORY ];
	}

	/**
	 * Render the tag output.
	 *
	 * @return void
	 */
	public function render() {
		$product = sc_get_product();
		echo esc_html( $product ? $product->sku : 'ABC-12345-S-BL' );
	}
}
