<?php
namespace SureCart\Integrations\Elementor\Conditions;

use ElementorPro\Modules\QueryControl\Module as QueryModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class ProductSingle extends \ElementorPro\Modules\ThemeBuilder\Conditions\Condition_Base {
	public static function get_type() {
		return 'surecart-single-product';
	}

	public static function get_priority() {
		return 40;
	}

	public function get_name() {
		return 'surecart-single-product';
	}

	public function get_label() {
		return __( 'Product', 'elementor-pro' );
	}

	public function get_all_label() {
		return __( 'Products', 'elementor-pro' );
	}

	public function check( $args ) {
		return true;
		// if ( isset( $args['id'] ) ) {
		// $id = (int) $args['id'];
		// if ( $id ) {
		// return is_singular() && get_queried_object_id() === $id;
		// }
		// }

		// return true;
	}

	protected function register_controls() {
		$this->add_control(
			'post_id',
			[
				'section'        => 'settings',
				'type'           => QueryModule::QUERY_CONTROL_ID,
				'select2options' => [
					'dropdownCssClass' => 'elementor-conditions-select2-dropdown',
				],
				'autocomplete'   => [
					'object' => QueryModule::QUERY_OBJECT_POST,
					'query'  => [
						'post_type' => 'post',
					],
				],
			]
		);
	}
}
