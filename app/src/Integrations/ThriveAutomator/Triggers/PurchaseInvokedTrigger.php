<?php

namespace SureCart\Integrations\ThriveAutomator\Triggers;

use SureCart\Integrations\ThriveAutomator\DataObjects\ProductDataObject;
use SureCart\Integrations\ThriveAutomator\ThriveAutomatorApp;
use Thrive\Automator\Items\Trigger;

/**
 * Handles the purchase revoked event.
 */
class PurchaseInvokedTrigger extends Trigger {
	/**
	 * Get the trigger identifier
	 *
	 * @return string
	 */
	public static function get_id() {
		return 'surecart_purchase_invoked';
	}

	/**
	 * Get the trigger hook
	 *
	 * @return string
	 */
	public static function get_wp_hook() {
		return 'surecart/purchase_invoked';
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
		return __( 'Purchase is un-revoked', 'surecart' );
	}

	/**
	 * Get the trigger description
	 *
	 * @return string
	 */
	public static function get_description() {
		return 'This trigger will be fired when a purchase is un-revoked.';
	}

	/**
	 * Get the trigger logo
	 *
	 * @return string
	 */
	public static function get_image() {
		return esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'app/src/Integrations/ThriveAutomator/images/icon.svg' );
	}
}
