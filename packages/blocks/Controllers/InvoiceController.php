<?php
namespace CheckoutEngineBlocks\Controllers;

use CheckoutEngine\Models\Component;
use CheckoutEngine\Models\User;

/**
 * The subscription controller.
 */
class InvoiceController extends BaseController {
	/**
	 * Preview.
	 */
	public function preview() {
		if ( ! User::current()->isCustomer() ) {
			return;
		}

		return wp_kses_post(
			Component::tag( 'ce-invoices-list' )
			->id( 'customer-invoices-preview' )
			->with(
				[
					'heading' => __( 'Invoice History', 'checkout-engine' ),
					'allLink' => add_query_arg(
						[
							'tab'    => $this->getTab(),
							'model'  => 'invoice',
							'action' => 'index',
						],
						\CheckoutEngine::pages()->url( 'dashboard' )
					),
					'query'   => [
						'customer_ids' => array_values( User::current()->customerIds() ),
						'status'       => [ 'paid' ],
						'page'         => 1,
						'per_page'     => 5,
					],
				]
			)->render()
		);
	}

	/**
	 * Index.
	 */
	public function index() {
		if ( ! User::current()->isCustomer() ) {
			return;
		}

		return wp_kses_post(
			Component::tag( 'ce-invoices-list' )
			->id( 'customer-invoices-index' )
			->with(
				[
					'heading' => __( 'Invoice History', 'checkout-engine' ),
					'query'   => [
						'customer_ids' => array_values( User::current()->customerIds() ),
						'status'       => [ 'paid' ],
						'page'         => 1,
						'per_page'     => 10,
					],
				]
			)->render()
		);
	}
}
