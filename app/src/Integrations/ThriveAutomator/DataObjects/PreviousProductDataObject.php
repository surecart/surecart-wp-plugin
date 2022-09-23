<?php

namespace SureCart\Integrations\ThriveAutomator\DataObjects;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Silence is golden!
}

/**
 * Class ProductDataObject
 */
class PreviousProductDataObject extends ProductDataObject {
	/**
	 * Get the data-object identifier
	 *
	 * @return string
	 */
	public static function get_id() {
		return 'surecart_previous_product_data';
	}
}
