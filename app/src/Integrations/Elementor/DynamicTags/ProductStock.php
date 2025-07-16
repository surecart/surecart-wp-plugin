<?php

namespace SureCart\Integrations\Elementor\DynamicTags;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Stock Dynamic Tag.
 */
class ProductStock extends \Elementor\Core\DynamicTags\Tag {
	/**
	 * Get the tag name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-stock';
	}

	/**
	 * Get the tag title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product stock', 'surecart' );
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
	 * Register dynamic tag controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->add_control(
			'stock_type',
			[
				'label'   => esc_html__( 'Stock Type', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'default' => 'available_stock',
				'options' => [
					'on_hand'         => esc_html__( 'On Hand', 'surecart' ),
					'held_stock'      => esc_html__( 'Held Stock', 'surecart' ),
					'available_stock' => esc_html__( 'Available Stock', 'surecart' ),
				],
			]
		);
	}

	/**
	 * Render the tag output.
	 *
	 * @return void
	 */
	public function render() {
		$product    = sc_get_product();
		$stock_type = $this->get_settings( 'stock_type' );

		if ( empty( $product ) ) {
			echo '9';
			return;
		}

		// unlimited stock, don't display stock.
		if ( $product->has_unlimited_stock ) {
			return;
		}

		switch ( $stock_type ) {
			case 'on_hand':
				echo (int) $product->stock;
				break;
			case 'held_stock':
				echo (int) $product->held_stock;
				break;
			default:
				echo (int) $product->available_stock;
				break;
		}
	}
}
