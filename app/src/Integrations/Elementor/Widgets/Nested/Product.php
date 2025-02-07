<?php

namespace SureCart\Integrations\Elementor\Widgets\Nested;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product widget.
 */
class Product extends \Elementor\Modules\NestedElements\Base\Widget_Nested_Base {
	/**
	 * Get the widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product';
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
		return esc_html__( 'Product Page', 'surecart' );
	}

	/**
	 * Get the widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-product-pages';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return [ 'product', 'surecart' ];
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return array( 'surecart-elementor-product' );
	}

	/**
	 * Get the widget script dependencies.
	 *
	 * @return array
	 */
	public function get_script_depends() {
		return array( 'surecart-elementor-product' );
	}

	/**
	 * Get the default children elements.
	 *
	 * @return array
	 */
	protected function get_default_children_elements() {
		return [];
	}

	/**
	 * Get the default repeater title setting key.
	 *
	 * @return string
	 */
	protected function get_default_repeater_title_setting_key() {
		return 'surecart_item_title';
	}

	/**
	 * Render the content template.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<div class="e-n-product">
		</div>
		<?php
	}
}
