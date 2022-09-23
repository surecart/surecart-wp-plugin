<?php

namespace SureCart\Integrations\ThriveAutomator\DataObjects;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Silence is golden!
}

use SureCart\Integrations\ThriveAutomator\DataFields\PreviousProductDataField;
use SureCart\Integrations\ThriveAutomator\DataFields\ProductDataField;
use SureCart\Integrations\ThriveAutomator\DataFields\ProductIDDataField;
use SureCart\Integrations\ThriveAutomator\DataFields\ProductNameDataField;
use Thrive\Automator\Items\Data_Object;
use SureCart\Models\Product;

/**
 * Class ProductDataObject
 */
class ProductDataObject extends ProductDataObject {
	/**
	 * Get the data-object identifier
	 *
	 * @return string
	 */
	public static function get_id() {
		return 'surecart_previous_product_data';
	}
}
