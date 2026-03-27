<?php

namespace SureCart\Integrations\Elementor\Conditions;

use ElementorPro\Modules\ThemeBuilder;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Condition.
 */
class ProductCondition extends ThemeBuilder\Conditions\Post {
	/**
	 * Get the type of the condition.
	 *
	 * @return void
	 */
	public function register_sub_conditions() {
		parent::register_sub_conditions();

		$this->register_sub_condition( new ProductSingle() );
	}

	/**
	 * Check condition.
	 *
	 * @param array $args The arguments.
	 *
	 * @return bool
	 */
	public function check( $args ) {
		if ( ! empty( get_query_var( 'surecart_current_product' ) ) ) {
			return true;
		}

		return parent::check( $args );
	}
}
