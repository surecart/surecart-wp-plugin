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
	 * Edit the invoice.
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( InvoiceScriptsController::class, 'enqueue' ) );

		$invoice = null;
		if ( $request->query( 'id' ) ) {
			$invoice = Invoice::with(
				[
					'checkout',
					'checkout.line_items',
					'line_item.price',
					'line_item.fees',
					'line_item.variant',
					'price.product',
					'product.featured_product_media',
					'product_media.media',
					'checkout.customer',
					'customer.shipping_address',
					'checkout.payment_intent',
					'checkout.discount',
					'discount.promotion',
					'discount.coupon',
					'checkout.shipping_address',
					'checkout.shipping_choices',
					'shipping_choices.shipping_method',
					'payment_method.card',
					'checkout.tax_identifier',
					'checkout.order',
					'checkout.payment_method',
					'checkout.manual_payment_method',
				]
			)->find( $request->query( 'id' ) );

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
