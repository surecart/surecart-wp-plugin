<?php

namespace SureCart\Integrations\ThriveAutomator\Actions;

use SureCart\Integrations\ThriveAutomator\ThriveAutomatorApp;
use Thrive\Automator\Items\Action;

class RevokePurchaseAction extends Action {
	/**
	 * Get the action identifier
	 *
	 * @return string
	 */
	public static function get_id() {
		return 'surecart_revoke_purchase_action';
	}

	/**
	 * Get the action name/label
	 *
	 * @return string
	 */
	public static function get_name() {
		return 'Revoke Purchase';
	}

	/**
	 * Get the action description
	 *
	 * @return string
	 */
	public static function get_description() {
		return 'Revoke SureCart Purchase';
	}

	/**
	 * Get the action logo
	 *
	 * @return string
	 */
	public static function get_image() {
		return esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'app/src/Integrations/ThriveAutomator/images/icon.svg' );
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
		return array( 'surecart_products_action_field' );
	}

	/**
	 * Get an array of keys with the required data-objects
	 *
	 * @return array
	 */
	public static function get_required_data_objects() {
		return array( 'surecart_product_data' );
	}

	public function do_action( $data ) {
		return true;
	}
}
