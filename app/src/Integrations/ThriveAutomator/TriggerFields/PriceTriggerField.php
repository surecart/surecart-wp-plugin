<?php

namespace SureCart\Integrations\ThriveAutomator\TriggerFields;

use Thrive\Automator\Items\Trigger_Field;
use Thrive\Automator\Utils;

class PriceTriggerField extends Trigger_Field {
	/**
	 * Get the Trigger Field identifier
	 *
	 * @return string
	 */
	public static function get_id() {
		return 'surecart_price_trigger_field';
	}

	/**
	 * Get the Trigger Field name
	 *
	 * @return string
	 */
	public static function get_name() {
		return 'Price Field';
	}

	/**
	 * Get the Trigger Field description
	 *
	 * @return string
	 */
	public static function get_description() {
		return 'Select price for trigger field.';
	}

	/**
	 * Get the Trigger Field placeholder
	 *
	 * @return string
	 */
	public static function get_placeholder() {
		return 'Price Field';
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

	public static function get_options_callback( $trigger_id, $trigger_data ) {
		// log_it($trigger_id);
		// log_it($trigger_data);
		return [
			'none'   => [
				'id'    => 'none',
				'label' => 'None',
			],
			'custom' => [
				'id'    => 'custom',
				'label' => 'Custom',
			],

		];
	}

}
