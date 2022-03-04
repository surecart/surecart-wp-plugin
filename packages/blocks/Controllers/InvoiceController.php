<?php
namespace CheckoutEngineBlocks\Controllers;

use CheckoutEngine\Models\Component;
use CheckoutEngine\Models\User;

/**
 * The subscription controller.
 */
class InvoiceController extends BaseController {
	/**
	 * Customer invoices preview.
	 */
	public function preview() {
		if ( ! User::current()->isCustomer() ) {
			return;
		}

		return wp_kses_post(
			Component::tag( 'ce-invoices-list' )
			->id( 'customer-invoices-list' )
			->with(
				[
					'header' => __( 'Invoice History', 'checkout-engine' ),
					'query'  => [
						'customer_ids' => array_values( User::current()->customerIds() ),
						'status'       => [ 'paid' ],
						'page'         => 1,
						'per_page'     => 5,
					],
				]
			)->render()
		);
	}
}
