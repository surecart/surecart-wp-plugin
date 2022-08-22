<?php

namespace SureCart\Integrations\ThriveAutomator\ActionFields;

use Thrive\Automator\Items\Action_Field;
use function wc_get_products;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Silence is golden!
}

/**
 * Class ProductsField
 */
class ProductsActionField extends Action_Field {
	/**
	 * Get ID
	 */
	public static function get_id() {
		return 'surecart_products_action_field';
	}
	/**
	 * Field name
	 */
	public static function get_name() {
		return 'Which product should be added to the order?';
	}

	/**
	 * Field description
	 */
	public static function get_description() {
		return 'Select products to add them to the order';
	}

	/**
	 * Field input placeholder
	 */
	public static function get_placeholder() {
		return '';
	}

	/**
	 * $$value will be replaced by field value
	 * $$length will be replaced by value length
	 *
	 * @return string
	 */
	public static function get_preview_template() {
		return 'Product: $$value';
	}

	/**
	 * For multiple option inputs, name of the callback function called through ajax to get the options
	 */
	public static function get_options_callback( $action_id, $action_data ) {
		$products = array();
		foreach ( wc_get_products( array( 'limit' => - 1 ) ) as $key => $product ) {
			$id               = $product->get_id();
			$products[ $key ] = array(
				'label' => $product->get_name(),
				'id'    => $id,
			);
		}

		return $products;
	}

	public static function get_type() {
		return 'autocomplete';
	}

	public static function is_ajax_field() {
		return true;
	}

	public static function get_validators() {
		return array( 'required' );
	}
}
