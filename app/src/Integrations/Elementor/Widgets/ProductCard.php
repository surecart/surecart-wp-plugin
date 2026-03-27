<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Card widget.
 */
class ProductCard extends \Elementor\Widget_Base {
	/**
	 * Get the widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-card';
	}

	/**
	 * Get the style dependencies.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array( 'surecart-elementor-container-style' );
	}

	/**
	 * Get the widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Card', 'surecart' );
	}

	/**
	 * Get the widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-info-box';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return [ 'product', 'card', 'surecart' ];
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return [ 'surecart-elementor-layout' ];
	}
}
