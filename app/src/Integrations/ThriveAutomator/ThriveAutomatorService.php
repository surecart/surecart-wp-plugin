<?php
namespace SureCart\Integrations\ThriveAutomator;

// use SureCart\Integrations\ThriveAutomator\ActionFields\ProductsField;
// use SureCart\Integrations\ThriveAutomator\Actions\OrderStatusUpdate;
use SureCart\Integrations\ThriveAutomator\DataObjects\ProductData;
use SureCart\Integrations\ThriveAutomator\Fields\ProductNameField;
use SureCart\Integrations\ThriveAutomator\Triggers\PurchaseCreatedTrigger;
use SureCart\Integrations\ThriveAutomator\Triggers\PurchaseRevokedTrigger;
use SureCart\Integrations\ThriveAutomator\Triggers\PurchaseInvokedTrigger;
use SureCart\Integrations\ThriveAutomator\Triggers\OrderCreatedTrigger;

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

		// fields.
		thrive_automator_register_data_field( ProductNameField::class );

		// data objects.
		thrive_automator_register_data_object( ProductData::class );
	}
}
