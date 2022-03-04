<?php
namespace CheckoutEngineBlocks\Controllers;

use CheckoutEngine\Models\Component;
use CheckoutEngine\Models\User;

/**
 * The subscription controller.
 */
class OrderController extends BaseController {
	/**
	 * Preview.
	 */
	public function preview() {
		if ( ! User::current()->isCustomer() ) {
			return;
		}

		return wp_kses_post(
			Component::tag( 'ce-orders-list' )
			->id( 'customer-orders-preview' )
			->with(
				[
					'heading' => __( 'Order History', 'checkout-engine' ),
					'allLink' => add_query_arg(
						[
							'tab'    => $this->getTab(),
							'model'  => 'order',
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
			Component::tag( 'ce-orders-list' )
			->id( 'customer-orders-index' )
			->with(
				[
					'heading' => __( 'Order History', 'checkout-engine' ),
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
