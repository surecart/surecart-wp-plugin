<?php

namespace SureCart\Integrations\ThriveAutomator\DataFields;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Silence is golden!
}

use SureCart\Models\Product;
use Thrive\Automator\Items\Data_Field;

/**
 * Class ProductDataField
 */
class PreviousProductDataField extends ProductDataField {
	/**
	 * Get the data field identifier
	 *
	 * @return string
	 */
	public static function get_id() {
		return 'surecart_previous_product_data_field';
	}

	/**
	 * Get the data field name
	 *
	 * @return string
	 */
	public static function get_name() {
		return 'Previous Product';
	}

	/**
	 * Get the data field description
	 *
	 * @return string
	 */
	public static function get_description() {
		return 'Show all SureCart Products';
	}
}
