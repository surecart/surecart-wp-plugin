<?php

namespace SureCart\Integrations\Elementor\DynamicTags;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Selected price trial dynamic tag.
 */
class SelectedPriceTrial extends \Elementor\Core\DynamicTags\Tag {
	/**
	 * Get the tag name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-selected-price-trial';
	}

	/**
	 * Get the tag title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product selected price trial', 'surecart' );
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

		if ( ! $product || ( empty( $product->initial_price->trial_text ?? null ) && \Elementor\Plugin::$instance->editor->is_edit_mode() ) ) {
			echo "<span class='wp-block-surecart-product-selected-price-trial'>" . esc_html__( 'Starting in 15 days.', 'surecart' ) . '</span>';
			return;
		}

		echo '<!-- wp:surecart/product-selected-price-trial -->' . esc_html( $product->initial_price->trial_text ?? '' ) . '<!-- /wp:surecart/product-selected-price-trial -->';
	}
}
