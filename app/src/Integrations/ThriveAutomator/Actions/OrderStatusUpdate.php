<?php

namespace SureCart\Integrations\ThriveAutomator\Actions;

use Exception;
use SureCart\Integrations\ThriveAutomator\ThriveAutomatorApp;
use Thrive\Automator\Items\Data_Object;
use function wc_get_product;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Silence is golden!
}

class OrderStatusUpdate {

	private $status;

	/**
	 * Get the action identifier
	 *
	 * @return string
	 */
	public static function get_id() {
		return 'surecart/orderstatus';
	}

	/**
	 * Get the action name/label
	 *
	 * @return string
	 */
	public static function get_name() {
		return 'Update SureCart order status';
	}

	/**
	 * Get the action description
	 *
	 * @return string
	 */
	public static function get_description() {
		return 'Change the status of a SureCart order';
	}

	/**
	 * Get the action logo
	 *
	 * @return string
	 */
	public static function get_image() {
		return 'woo-update-order-status';
	}

	/**
	 * Get the name of app to which action belongs
	 *
	 * @return string
	 */
	public static function get_app_id() {
		return ThriveAutomatorApp::get_id();
	}

	/**
	 * Array of action-field keys, required for the action to be setup
	 *
	 * @return array
	 */
	public static function get_required_action_fields() {
		return array( 'surecart/products' );
	}

	/**
	 * Get an array of keys with the required data-objects
	 *
	 * @return array
	 */
	public static function get_required_data_objects() {
		return array( 'surecart/product_data' );
	}

	public function prepare_data( $data = array() ) {
		if ( ! empty( $data['extra_data'] ) ) {
			$data = $data['extra_data'];
		}

		$this->status = $data['woo_order_status']['value'];
	}

	public function do_action( $data ) {
		global $automation_data;
		$order_data = $automation_data->get( 'woo_order_data' );
		if ( empty( $order_data ) ) {
			return false;
		}

		$order = wc_get_order( $order_data->get_value( 'order_id' ) );

		if ( empty( $order ) ) {
			return false;
		}

		$order->set_status( $this->status, '', true );
	}

}
