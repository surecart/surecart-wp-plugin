<?php

namespace SureCart\Integrations\Elementor\DynamicTags;

use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product selected price dynamic tag.
 */
class SelectedPrice extends \Elementor\Core\DynamicTags\Tag {
	/**
	 * Get the name of the tag.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'product-selected-price';
	}

	/**
	 * Get the title of the tag.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product selected price', 'surecart' );
	}

	/**
	 * Get the group of the tag.
	 *
	 * @return string
	 */
	public function get_group() {
		return 'surecart-product';
	}

	/**
	 * Get the categories of the tag.
	 *
	 * @return array
	 */
	public function get_categories() {
		return [ \Elementor\Modules\DynamicTags\Module::TEXT_CATEGORY ];
	}

	/**
	 * Render the tag.
	 *
	 * @return void
	 */
	public function render() {
		$product = sc_get_product();

		if ( ! $product || ( empty( $product->initial_price->display_amount ?? null ) && \Elementor\Plugin::$instance->editor->is_edit_mode() ) ) {
			echo "<span class='wp-block-surecart-product-selected-price-amount'>" . Currency::format( 1200 ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}

		echo '<!-- wp:surecart/product-selected-price-amount -->' . esc_html( $product->initial_price->display_amount ?? '' ) . ' <!-- /wp:surecart/product-selected-price-amount -->';
	}
}
