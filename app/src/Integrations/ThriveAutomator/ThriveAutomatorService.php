<?php

namespace SureCart\Integrations\ThriveAutomator;

use SureCart\Integrations\ThriveAutomator\ActionFields\ProductsActionField;
use SureCart\Integrations\ThriveAutomator\DataObjects\ProductDataObject;
use SureCart\Integrations\ThriveAutomator\DataFields\ProductDataField;
use SureCart\Integrations\ThriveAutomator\DataFields\ProductIDDataField;
use SureCart\Integrations\ThriveAutomator\DataFields\ProductNameDataField;
use SureCart\Integrations\ThriveAutomator\TriggerFields\PriceTriggerField;
use SureCart\Integrations\ThriveAutomator\TriggerFields\ProductTriggerField;
use SureCart\Integrations\ThriveAutomator\Triggers\PurchaseCreatedTrigger;
use SureCart\Integrations\ThriveAutomator\Triggers\PurchaseRevokedTrigger;
use SureCart\Integrations\ThriveAutomator\Triggers\PurchaseInvokedTrigger;
use SureCart\Integrations\ThriveAutomator\Triggers\PurchaseUpdatedTrigger;
use SureCart\Integrations\ThriveAutomator\Triggers\RefundSucceededTrigger;

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

		// action fields
		thrive_automator_register_action_field( ProductsActionField::class );

		// data objects
		thrive_automator_register_data_object( ProductDataObject::class );

		// data fields
		thrive_automator_register_data_field( ProductNameDataField::class );
		thrive_automator_register_data_field( ProductIDDataField::class );
		thrive_automator_register_data_field( ProductDataField::class );

		// triggers
		thrive_automator_register_trigger( PurchaseCreatedTrigger::class );
		thrive_automator_register_trigger( PurchaseRevokedTrigger::class );
		thrive_automator_register_trigger( PurchaseInvokedTrigger::class );
		thrive_automator_register_trigger( PurchaseUpdatedTrigger::class );
		thrive_automator_register_trigger( RefundSucceededTrigger::class );

		// trigger fields
		thrive_automator_register_trigger_field( ProductTriggerField::class );
		thrive_automator_register_trigger_field( PriceTriggerField::class );
	}

}
