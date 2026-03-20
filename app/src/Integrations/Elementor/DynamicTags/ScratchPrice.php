<?php

namespace SureCart\Integrations\Elementor\DynamicTags;

use SureCart\Support\Currency;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Scratch Price Dynamic Tag.
 */
class ScratchPrice extends \Elementor\Core\DynamicTags\Tag {
	/**
	 * Get the tag name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-scratch-price';
	}

	/**
	 * Get the tag title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product scratch price', 'surecart' );
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
	 * Register dynamic tag controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->add_control(
			'price_type',
			[
				'label'   => esc_html__( 'Scratch Price Type', 'surecart' ),
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
	 * Render the tag output.
	 *
	 * @return void
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

		switch ( $price_type ) {
			case 'raw':
				echo esc_html( $product ? $product->scratch_amount : '' );
				break;
			case 'value':
				echo esc_html( $product ? Currency::maybeConvertAmount( $product->scratch_amount ) : '' );
				break;
			default:
				echo esc_html( $product->scratch_display_amount );
				break;
		}
	}
}
