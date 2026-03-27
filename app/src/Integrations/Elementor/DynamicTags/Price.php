<?php

namespace SureCart\Integrations\Elementor\DynamicTags;

use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Price Dynamic Tag.
 */
class Price extends \Elementor\Core\DynamicTags\Tag {
	/**
	 * Get Name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'sc_product_price';
	}

	/**
	 * Get Title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product price', 'surecart' );
	}

	/**
	 * Get Group.
	 *
	 * @return string
	 */
	public function get_group() {
		return 'surecart-product';
	}

	/**
	 * Get Categories.
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
			'price_type',
			[
				'label'   => esc_html__( 'Price Type', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					''      => esc_html__( 'Formatted', 'surecart' ),
					'raw'   => esc_html__( 'Raw', 'surecart' ),
					'value' => esc_html__( 'Value', 'surecart' ),
				],
			]
		);
	}

	/**
	 * Render.
	 */
	public function render() {
		$product    = sc_get_product();
		$price_type = $this->get_settings( 'price_type' );

		if ( empty( $product ) ) {
			switch ( $price_type ) {
				case 'raw':
					echo esc_html( 65 );
					break;
				case 'value':
					echo esc_html( 65.3 );
					break;
				default:
					echo esc_html( Currency::format( 1200 ) );
					break;
			}

			return;
		}

		// If the product has no initial price, return an empty string.
		if ( empty( $product->initial_price->id ) ) {
			return '';
		}

		switch ( $price_type ) {
			case 'raw':
				echo esc_html( $product ? $product->initial_amount : '' );
				break;
			case 'value':
				echo esc_html( $product ? Currency::maybeConvertAmount( $product->initial_amount ) : '' );
				break;
			default:
				echo esc_html( $product->initial_price->display_amount );
				break;
		}
	}
}
