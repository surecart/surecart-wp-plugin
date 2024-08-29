<?php

namespace SureCart\Integrations\Bricks\Elements;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Product element.
 */
class Product extends \Elementor\Modules\NestedElements\Base\Widget_Nested_Base {
	/**
	 * Get the name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product';
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product', 'surecart' );
	}

	/**
	 * Get the icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-product';
	}

	/**
	 * Get the keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return [ 'product', 'surecart', 'page' ];
	}

	/**
	 * Get the default children elements.
	 *
	 * @return array
	 */
	protected function get_default_children_elements() {
		return array(
			array(
				'elType'   => 'container',
				'settings' => [
					'_title'        => esc_html__( 'Product Title', 'surecart' ),
					'content_width' => 'full',
				],
			),
		);
	}

	/**
	 * Get the default repeater title setting key.
	 *
	 * @return string
	 */
	protected function get_default_repeater_title_setting_key() {
		return '_title';
	}

	/**
	 * Get the default children title.
	 *
	 * @return string
	 */
	protected function get_default_children_title() {
		return esc_html__( 'Product #%d', 'surecart' );
	}

	/**
	 * Get the default children placeholder selector.
	 *
	 * @return string
	 */
	protected function get_default_children_placeholder_selector() {
		return '.elementor-widget-container';
	}

	/**
	 * Get the html wrapper class
	 *
	 * @return string
	 */
	protected function get_html_wrapper_class() {
		return 'elementor-product';
	}

	/**
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function _register_controls() {
		$this->start_controls_section(
			'section_product',
			[
				'label' => esc_html__( 'Product', 'surecart' ),
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render the widget.
	 *
	 * @return void
	 */
	protected function render() {
		// Get the settings.
		$settings = $this->get_settings_for_display();

		// Get the children elements.
		$children_elements = $this->get_children_elements();

		// Render the children elements.
		foreach ( $children_elements as $child_element ) {
			\Elementor\Plugin::$instance->elements_manager->print_element( $child_element );
		}
	}

	/**
	 * Content template.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<div class="elementor-product">
		</div>
		<?php
	}
}
