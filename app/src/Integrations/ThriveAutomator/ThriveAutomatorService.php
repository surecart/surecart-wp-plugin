<?php
namespace SureCart\Integrations\ThriveAutomator;

use SureCart\Integrations\ThriveAutomator\Fields\ProductDataField;
use SureCart\Integrations\ThriveAutomator\Fields\PurchaseIdDataField;
use SureCart\Integrations\ThriveAutomator\DataObjects\PurchaseData;
use SureCart\Integrations\ThriveAutomator\Triggers\PurchaseCreatedTrigger;

/**
 * Bootstrap the Thrive Automator integration.
 */
class ThriveAutomatorService {
	/**
	 * Bootstrap
	 *
	 * @return void
	 */
	public function bootstrap() {
		if ( ! function_exists( 'thrive_automator_register_app' ) ) {
			return;
		}
		// app.
		thrive_automator_register_app( ThriveAutomatorApp::class );
		// trigger.
		thrive_automator_register_trigger( PurchaseCreatedTrigger::class );
		thrive_automator_register_action( PurchaseRevokeAction::class );

		thrive_automator_register_data_object( PurchaseData::class );
		thrive_automator_register_data_field( PurchaseIdDataField::class );
		thrive_automator_register_data_field( ProductDataField::class );
	}
}
