<?php

namespace SureCart\Integrations\Elementor\DynamicTags;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Selected Billing Interval Dynamic Tag.
 */
class SelectedBillingInterval extends \Elementor\Core\DynamicTags\Tag {
	/**
	 * Get the tag name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-selected-billing-interval';
	}

	/**
	 * Get the tag title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product selected price billing interval', 'surecart' );
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

		if ( ! $product || ( empty( $product->initial_price->interval_text ?? null ) && \Elementor\Plugin::$instance->editor->is_edit_mode() ) ) {
			echo "<span class='wp-block-surecart-product-selected-price-interval sc-price__amount'>" . esc_html__( '/ day (3 payments)', 'surecart' ) . '</span>';
			return;
		}

		echo '<!-- wp:surecart/product-selected-price-interval -->' . esc_html( $product->initial_price->interval_text ?? '' ) . '<!-- /wp:surecart/product-selected-price-interval -->';
	}
}
