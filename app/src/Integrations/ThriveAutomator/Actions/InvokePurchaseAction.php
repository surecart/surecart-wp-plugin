<?php

namespace SureCart\Integrations\ThriveAutomator\Actions;

use SureCart\Integrations\ThriveAutomator\ThriveAutomatorApp;
use Thrive\Automator\Items\Action;

class InvokePurchaseAction extends Action {
	public static function get_id() {
		return 'surecart_invoke_purchase_action';
	}

	public static function get_name() {
		return 'Invoke Purchase';
	}

	public static function get_description() {
		return 'Invoke SureCart Purchase';
	}

	public static function get_image() {
		return esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'app/src/Integrations/ThriveAutomator/images/icon.svg' );
	}

	public static function get_app_id() {
		return ThriveAutomatorApp::get_id();
	}

	public static function get_required_action_fields() {
		return array( 'surecart_products' );
	}

	public static function get_required_data_objects() {
		return array( 'surecart_product_data' );
	}

	public function do_action( $data ) {
		return true;
	}
}
