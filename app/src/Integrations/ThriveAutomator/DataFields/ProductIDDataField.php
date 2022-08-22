<?php

namespace SureCart\Integrations\ThriveAutomator\DataFields;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Silence is golden!
}

use SureCart\Integrations\ThriveAutomator\DataObjects\ProductDataObject;
use Thrive\Automator\Items\Data_Field;

/** Product name field. */
class ProductIDDataField extends Data_Field {
	public static function get_id() {
		return 'surecart_product_id_data_field';
	}

	public static function get_name() {
		return __( 'Product ID', 'surecart' );
	}

	public static function get_description() {
		return __( 'A specific product id.', 'surecart' );
	}

	public static function get_placeholder() {
		return '';
	}

	public static function get_supported_filters() {
		return [ 'string_ec' ];
	}

	public static function get_validators() {
		return [ 'required' ];
	}

	public static function get_field_value_type() {
		return static::TYPE_STRING;
	}

	public static function get_dummy_value() {
		return 'Product ID';
	}

	public static function primary_key(): array {
		return [ ProductDataObject::get_id() ];
	}
}
