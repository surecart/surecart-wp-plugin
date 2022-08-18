<?php

namespace SureCart\Integrations\ThriveAutomator\TriggerFields;

use Thrive\Automator\Items\Trigger_Field;
use Thrive\Automator\Utils;

class ProductField extends Trigger_Field {
	/**
	 * Get the Trigger Field identifier
	 *
	 * @return string
	 */
	public static function get_id() {
		return 'surecart_product_field';
	}

	/**
	 * Get the Trigger Field name
	 *
	 * @return string
	 */
	public static function get_name() {
		return 'Product Field';
	}

	/**
	 * Get the Trigger Field description
	 *
	 * @return string
	 */
	public static function get_description() {
		return 'Select product for trigger field.';
	}

	/**
	 * Get the Trigger Field placeholder
	 *
	 * @return string
	 */
	public static function get_placeholder() {
		return 'Product Field';
	}

	/**
	 * Get the Trigger Field type
	 *
	 * @return string
	 */
	public static function get_type() {
		return Utils::FIELD_TYPE_AUTOCOMPLETE;
	}

	// public static function is_ajax_field() {
	// 	return true;
	// }

}
