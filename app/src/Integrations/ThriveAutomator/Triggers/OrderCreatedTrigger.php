<?php

namespace SureCart\Integrations\ThriveAutomator\Triggers;

use SureCart\Integrations\ThriveAutomator\DataObjects\ProductData;
use SureCart\Integrations\ThriveAutomator\ThriveAutomatorApp;
use Thrive\Automator\Items\Data_Object;
use Thrive\Automator\Items\Trigger;

/**
 * Handles the order created event.
 */
class OrderCreatedTrigger extends Trigger {
	/**
	 * Get the trigger identifier
	 *
	 * @return string
	 */
	public static function get_id() {
		return 'surecart_order_created';
	}

	/**
	 * Get the trigger hook
	 *
	 * @return string
	 */
	public static function get_wp_hook() {
		return 'surecart/order_created';
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
		return [ ProductData::get_id(), 'user_data' ];
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
		return __( 'Product order completed', 'surecart' );
	}

	/**
	 * Get the trigger description
	 *
	 * @return string
	 */
	public static function get_description() {
		return 'This trigger will be fired when someone first order a product.';
	}

	/**
	 * Get the trigger logo
	 *
	 * @return string
	 */
	public static function get_image() {
		return esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'app/src/Integrations/ThriveAutomator/images/icon.svg' );
	}


	public function process_params( $params = array() ) {
		$data = array();

		if ( ! empty( $params[1] ) ) {

			$data_object_classes = Data_Object::get();

			list ( $product, $user ) = $params;

			$data['surecart_product_data'] = empty( $data_object_classes['surecart_product_data'] ) ? $product : new $data_object_classes['surecart_product_data']( $product );
			$data['user_data']             = empty( $data_object_classes['user_data'] ) ? null : new $data_object_classes['user_data']( $user );
		}

		return $data;
	}
}
