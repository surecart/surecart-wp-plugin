<?php

namespace SureCart\Integrations\ThriveAutomator\Fields;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Silence is golden!
}

use Thrive\Automator\Items\Data_Field;
use SureCart\Models\Product;

/**
 * Class User_Role_Field
 */
class ProductDataField extends Data_Field {
	/**
	 * Field name
	 */
	public static function get_name() {
		return 'SureCart Product';
	}

	/**
	 * Field description
	 */
	public static function get_description() {
		return 'Show all SureCart Product';
	}

	/**
	 * Field input placeholder
	 */
	public static function get_placeholder() {
		return 'Select SureCart Product';
	}

	public static function get_id() {
		return 'surecart_product';
	}

	public static function get_supported_filters() {
		return [ 'dropdown' ];
	}

	/**
	 * For multiple option inputs, name of the callback function called through ajax to get the options
	 */
	public static function get_options_callback() {
		$roles = [];
		$products = Product::get();
		foreach ($products as $product) {
			$roles[ $product->id ] = [
				'label' => $product->name,
				'id'    => $product->id,
			];
		}

		return $roles;
	}

	public static function is_ajax_field() {
		return true;
	}

	public static function get_field_value_type() {
		return static::TYPE_ARRAY;
	}

	public static function get_dummy_value() {
		return 'subscriber';
	}

	public static function get_validators() {
		return [ 'required' ];
	}
}
