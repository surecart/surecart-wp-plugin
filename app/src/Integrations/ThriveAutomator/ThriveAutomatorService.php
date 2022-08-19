<?php

namespace SureCart\Integrations\ThriveAutomator;

// use SureCart\Integrations\ThriveAutomator\ActionFields\ProductsField;
// use SureCart\Integrations\ThriveAutomator\Actions\OrderStatusUpdate;

use SureCart\Integrations\ThriveAutomator\Actions\InvokePurchaseAction;
use SureCart\Integrations\ThriveAutomator\Actions\RevokePurchaseAction;
use SureCart\Integrations\ThriveAutomator\DataObjects\ProductData;
use SureCart\Integrations\ThriveAutomator\Fields\ProductDataField;
use SureCart\Integrations\ThriveAutomator\Fields\ProductIDField;
use SureCart\Integrations\ThriveAutomator\Fields\ProductNameField;
use SureCart\Integrations\ThriveAutomator\TriggerFields\PriceField;
use SureCart\Integrations\ThriveAutomator\TriggerFields\ProductField;
use SureCart\Integrations\ThriveAutomator\Triggers\PurchaseCreatedTrigger;
use SureCart\Integrations\ThriveAutomator\Triggers\PurchaseRevokedTrigger;
use SureCart\Integrations\ThriveAutomator\Triggers\PurchaseInvokedTrigger;
use SureCart\Integrations\ThriveAutomator\Triggers\OrderCreatedTrigger;
use SureCart\Integrations\ThriveAutomator\Triggers\PeriodPaidTrigger;
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

		// triggers.
		thrive_automator_register_trigger( PurchaseCreatedTrigger::class );
		thrive_automator_register_trigger( PurchaseRevokedTrigger::class );
		thrive_automator_register_trigger( PurchaseInvokedTrigger::class );
		thrive_automator_register_trigger( OrderCreatedTrigger::class );
		thrive_automator_register_trigger( PeriodPaidTrigger::class );
		thrive_automator_register_trigger( PurchaseUpdatedTrigger::class );
		thrive_automator_register_trigger( RefundSucceededTrigger::class );

		// trigger fields
		thrive_automator_register_trigger_field( ProductField::class );
		thrive_automator_register_trigger_field( PriceField::class );

		// actions
		thrive_automator_register_action( InvokePurchaseAction::class );
		thrive_automator_register_action( RevokePurchaseAction::class );

		// fields.
		thrive_automator_register_data_field( ProductNameField::class );
		thrive_automator_register_data_field( ProductIDField::class );
		thrive_automator_register_data_field( ProductDataField::class );

		// data objects.
		thrive_automator_register_data_object( ProductData::class );
	}
}
