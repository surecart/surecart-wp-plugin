<?php
namespace SureCart\Integrations\Elementor\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor Logged-In User Condition.
 *
 * Add a logged-in user condition to Elementor.
 *
 * @since 1.0.0
 */
class ProductCondition extends \ElementorPro\Modules\ThemeBuilder\Conditions\Condition_Base {

	public static function get_type() {
		return 'surecart-product';
	}

	public function get_name() {
		return 'surecart-product';
	}

	public function get_label() {
		return esc_html__( 'Product', 'elementor-pro' );
	}

	public function get_all_label() {
		return esc_html__( 'All Products', 'elementor-pro' );
	}

	public function register_sub_conditions() {
		$this->register_sub_condition( new ProductSingle() );
	}

	/**
	 * Check condition.
	 *
	 * Validate logged-in user condition to ensure it complies with certain rules.
	 *
	 * @since 1.0.0
	 * @access public
	 * @return bool
	 */
	public function check( $args ) {
		return is_user_logged_in();
	}
}
