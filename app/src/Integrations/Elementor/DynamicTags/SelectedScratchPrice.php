<?php

namespace SureCart\Integrations\Elementor\DynamicTags;

use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Selected Scratch Price Dynamic Tag.
 */
class SelectedScratchPrice extends \Elementor\Core\DynamicTags\Tag {
	/**
	 * Get the name of the tag.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-selected-scratch-price';
	}

	/**
	 * Get the title of the tag.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product selected scratch price', 'surecart' );
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
	 * Render the tag output.
	 *
	 * @return void
	 */
	public function render() {
		$product = sc_get_product();

		if ( ! $product || ( empty( $product->initial_price->scratch_display_amount ?? null ) && \Elementor\Plugin::$instance->editor->is_edit_mode() ) ) {
			echo "<span class='wp-block-surecart-product-selected-price-scratch-amount sc-price__amount'>" . esc_html( Currency::format( 1400 ) ) . '</span>';
			return;
		}

		echo '<!-- wp:surecart/product-selected-price-scratch-amount -->' . esc_html( $product->initial_price->scratch_display_amount ?? '' ) . ' <!-- /wp:surecart/product-selected-price-scratch-amount --> ';
	}
}
