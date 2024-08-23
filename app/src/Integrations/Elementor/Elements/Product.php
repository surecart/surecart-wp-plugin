<?php

namespace SureCart\Integrations\Elementor\Elements;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product element.
 */
class Product extends \Elementor\Element_Base {
	public static function get_type() {
		return 'surecart-product';
	}

	public function get_name() {
		return 'surecart-product';
	}

	public function get_title() {
		return __( 'Product', 'surecart' );
	}

	public function get_icon() {
		return 'eicon-columns';
	}

	protected function is_dynamic_content(): bool {
		return false;
	}

	public function content_template() {
		?>
		<div class="surecart-product elementor-container">
		</div>
		<?php
	}

	public function before_render() {
		?>
		<div class = 'surecart-product elementor-container' >
		<?php
	}

	public function after_render() {
		?>
		</div>
		<?php
	}

	protected function _get_default_child_type( array $element_data ) {
		return 'surecart-product';
	}
}
