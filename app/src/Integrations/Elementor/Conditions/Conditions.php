<?php
namespace SureCart\Integrations\Elementor\Conditions;

use ElementorPro\Modules\ThemeBuilder\Conditions\Condition_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Conditions extends Condition_Base {
	public static function get_type() {
		return 'surecart';
	}

	public function get_name() {
		return 'surecart';
	}

	public function get_label() {
		return esc_html__( 'SureCart', 'elementor-pro' );
	}

	public function get_all_label() {
		return esc_html__( 'All Products', 'elementor-pro' );
	}

	public function check( $args ) {
		return true;
	}

	public function register_sub_conditions() {
		$this->register_sub_condition( new ProductCondition() );
	}

}
