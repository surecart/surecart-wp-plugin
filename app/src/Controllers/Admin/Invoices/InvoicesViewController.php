<?php

namespace CheckoutEngine\Controllers\Admin\Invoices;

use CheckoutEngine\Controllers\Admin\Invoices\InvoicesListTable;

/**
 * Handles product admin requests.
 */
class InvoicesViewController {
	/**
	 * Invoices index.
	 */
	public function index() {
		$table = new InvoicesListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin/invoices/index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Coupons edit.
	 */
	public function edit() {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \CheckoutEngine::closure()->method( InvoiceScriptsController::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}

	public function archive( $request ) {
		// flash an error message
		\CheckoutEngine::flash()->add( 'errors', 'Please enter a valid email address.' );
		// redirect to order index page.
		return \CheckoutEngine::redirect()->to( \CheckoutEngine::getUrl()->index( 'invoice' ) );
	}
}
