<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Buy now button widget.
 */
class BuyButton extends AddToCartButton {
	/**
	 * Is this an add to cart button?
	 *
	 * @var boolean
	 */
	protected const IS_ADD_TO_CART = false;

	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-buy-button';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Buy Now Button', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-product-add-to-cart';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'buy', 'now', 'button' );
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return [ 'surecart-elementor-product' ];
	}

	/**
	 * Get the default button label.
	 *
	 * @return string
	 */
	protected function get_default_label(): string {
		return esc_html__( 'Buy Now', 'surecart' );
	}

	/**
	 * Register the widget content settings.
	 *
	 * @return void
	 */
	private function register_content_settings() {
		$this->start_controls_section(
			'section_content',
			[
				'label' => esc_html__( 'Content Settings', 'surecart' ),
			]
		);

		$this->add_control(
			'buy_button_type',
			[
				'label'       => esc_html__( 'Go Directly To Checkout', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SWITCHER,
				'label_on'    => esc_html__( 'Yes', 'surecart' ),
				'label_off'   => esc_html__( 'No', 'surecart' ),
				'default'     => 'no',
				'description' => esc_html__( 'Bypass adding to cart and go directly to the checkout.', 'surecart' ),
			]
		);

		$this->end_controls_section();

		/**
		 * Register the default text settings.
		 */
		$this->register_text_settings();
	}
}
