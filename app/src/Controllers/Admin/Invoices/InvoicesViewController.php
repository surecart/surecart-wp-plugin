<?php

namespace SureCart\Controllers\Admin\Invoices;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\Invoices\InvoicesListTable;
use SureCart\Models\Invoice;

/**
 * Handles invoice admin requests.
 */
class InvoicesViewController extends AdminController {
	/**
	 * Invoices index.
	 */
	public function index() {
		$table = new InvoicesListTable();
		$table->prepare_items();
		$this->withHeader(
			array(
				'breadcrumbs' => [
					'invoices' => [
						'title' => __( 'Invoices', 'surecart' ),
					],
				],
				'test_mode_toggle' => true,
			)
		);
		return \SureCart::view( 'admin/invoices/index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Edit a invoice.
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( InvoiceScriptsController::class, 'enqueue' ) );

		$invoice = null;
		if ( $request->query( 'id' ) ) {
			$invoice = Invoice::find( $request->query( 'id' ) );

			if ( is_wp_error( $invoice ) ) {
				wp_die( implode( ' ', array_map( 'esc_html', $invoice->get_error_messages() ) ) );
			}
		}

		if ( ! empty( $invoice ) ) {
			$this->preloadPaths(
				[
					'/surecart/v1/invoices/' . $invoice->id . '?context=edit',
				]
			);
		}

		// return view.
		return '<div id="app"></div>';
	}
}
