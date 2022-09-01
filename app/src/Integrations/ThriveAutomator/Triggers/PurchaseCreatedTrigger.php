<?php

namespace SureCart\Integrations\ThriveAutomator\Triggers;

use SureCart\Integrations\ThriveAutomator\DataObjects\ProductDataObject;
use SureCart\Integrations\ThriveAutomator\ThriveAutomatorApp;
use Thrive\Automator\Items\Data_Object;
use Thrive\Automator\Items\Trigger;

/**
 * Handles the purchase created event.
 */
class PurchaseCreatedTrigger extends Trigger {
	/**
	 * Get the trigger identifier
	 *
	 * @return string
	 */
	public static function get_id() {
		return 'surecart_purchase_created';
	}

	/**
	 * Get the trigger hook
	 *
	 * @return string
	 */
	public static function get_wp_hook() {
		return 'surecart/purchase_created';
	}

	/**
	 * Get the app id.
	 *
	 * @return string
	 */
	public static function get_app_id() {
		return ThriveAutomatorApp::get_id();
	}

	/**
	 * Get the trigger provided params
	 *
	 * @return array
	 */
	public static function get_provided_data_objects() {
		// return [ ProductDataObject::get_id(), 'user_data' ];
		return [ ProductDataObject::get_id() ];
	}

	/**
	 * Get the number of params
	 *
	 * @return int
	 */
	public static function get_hook_params_number() {
		return 1;
	}

	/**
	 * Get the trigger name
	 *
	 * @return string
	 */
	public static function get_name() {
		return __( 'Product purchase completed', 'surecart' );
	}

	/**
	 * Get the trigger description
	 *
	 * @return string
	 */
	public static function get_description() {
		return 'This trigger will be fired when someone first purchases a product.';
	}

	/**
	 * Get the trigger logo
	 *
	 * @return string
	 */
	public static function get_image() {
		return esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'app/src/Integrations/ThriveAutomator/images/icon.svg' );
	}


	public function process_params( $params = [] ) {
		// log_it('Trigger 1');
		// log_it($params);
		$data = [];

		if ( ! empty( $params ) ) {
			$data_object_classes = Data_Object::get();
			$product_id = $params[0]['product'];
			// log_it('Trigger 2');
			// log_it($data_object_classes);

			$data['surecart_product_data'] = empty( $data_object_classes['surecart_product_data'] ) ? null : new $data_object_classes['surecart_product_data']( $product_id );
			// $data['user_data']             = empty( $data_object_classes['user_data'] ) ? null : new $data_object_classes['user_data']();
		}
		// log_it('Trigger 3');
		// log_it($data);

		return $data;
	}
}
