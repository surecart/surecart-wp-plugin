<?php

namespace SureCart\Invoice;

use SureCart\Models\Invoice;

/**
 * Service for invoice related functionalities.
 */
class InvoiceService {
	public function bootstrap() {
		add_action( 'admin_init', [ $this, 'maybeCreateInvoice' ] );
	}

	/**
	 * Create invoice if not already created from the invoice edit page.
	 *
	 * @return void
	 */
	public function maybeCreateInvoice(): void {
		// Return if not on invoice edit page or invoice already created.
		if (
			! is_admin()
			|| empty( $_GET['page'] )
			|| 'sc-invoices' !== $_GET['page']
			|| ! isset( $_GET[ 'action' ] )
			|| 'edit' !== $_GET[ 'action' ]
			|| ! empty( $_GET['id'] )
		) {
			return;
		}

		$live_mode = isset( $_GET['live_mode'] ) ? rest_sanitize_boolean( $_GET['live_mode'] ) : true;
		$invoice   = ( new Invoice() )
			->create(
				[
					'live_mode' => $live_mode,
				]
			)->save();

		if ( is_wp_error( $invoice ) ) {
			wp_die( $invoice->get_error_message() );
		}

		wp_safe_redirect(
			admin_url( 'admin.php?page=sc-invoices&action=edit&id=' . $invoice->id . '&live_mode=' . $live_mode )
		);
		exit;
	}
}
