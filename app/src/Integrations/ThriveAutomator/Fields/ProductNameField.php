<?php
namespace SureCart\Integrations\ThriveAutomator\Fields;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Silence is golden!
}

use SureCart\Integrations\ThriveAutomator\DataObjects\ProductData;
use Thrive\Automator\Items\Data_Field;

/** Product name field. */
class ProductNameField extends Data_Field {
	public static function get_id() {
		return 'surecart_product_name';
	}

	public static function get_name() {
		return __( 'Product Name', 'surecart' );
	}

	public static function get_description() {
		return __( 'A specific product name.', 'surecart' );
	}

	public static function get_supported_filters() {
		return [ 'string_ec' ];
	}

	public static function get_validators() {
		return [ 'required' ];
	}

	public static function get_placeholder() {
		return '';
	}

	public static function get_field_value_type() {
		return static::TYPE_STRING;
	}

	public static function get_dummy_value() {
		return 'Product Name';
	}

	public static function primary_key(): array {
		return [ ProductData::get_id() ];
	}
}
