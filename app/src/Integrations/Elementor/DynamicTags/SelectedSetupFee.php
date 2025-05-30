<?php

namespace SureCart\Integrations\Elementor\DynamicTags;

use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Selected Setup Fee Dynamic Tag.
 */
class SelectedSetupFee extends \Elementor\Core\DynamicTags\Tag {
	/**
	 * Get the tag name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-selected-setup-fee';
	}


	/**
	 * Get the tag title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product selected setup fee', 'surecart' );
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

		if ( ! $product || ( empty( $product->initial_price->setup_fee_text ?? null ) && \Elementor\Plugin::$instance->editor->is_edit_mode() ) ) {
			// translators: %s: Setup Fee amount.
			echo "<span class='wp-block-surecart-product-selected-price-fees'>" . esc_html( sprintf( __( '%s setup fee.', 'surecart' ), Currency::format( 100 ) ) ) . '</span>';
			return;
		}

		echo '<!-- wp:surecart/product-selected-price-fees -->' . esc_html( $product->initial_price->setup_fee_text ?? '' ) . '<!-- /wp:surecart/product-selected-price-fees -->';
	}
}
