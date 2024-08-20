<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Product extends \Elementor\Widget_Base {
	public function get_name() {
		return 'surecart-product-page';
	}

	public function get_title() {
		return esc_html__( 'Product', 'elementor-addon' );
	}

	public function get_icon() {
		return 'eicon-code';
	}

	public function get_categories() {
		return [ 'surecart' ];
	}

	public function get_keywords() {
		return [ 'product', 'page' ];
	}

	protected function render() {
		?>
		<!-- wp:surecart/product-variant-pills -->
		<!-- wp:surecart/product-variant-pill /-->
		<!-- /wp:surecart/product-variant-pills -->
		<?php
	}

	protected function content_template() {
		?>
		<!-- wp:surecart/product-variant-pills -->
		<!-- wp:surecart/product-variant-pill /-->
		<!-- /wp:surecart/product-variant-pills -->
		<?php
	}
}
