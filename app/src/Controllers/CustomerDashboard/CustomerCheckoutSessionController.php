<?php

namespace CheckoutEngine\Controllers\CustomerDashboard;

use CheckoutEngine\Models\CheckoutSession;

/**
 * Customer order controller
 */
class CustomerCheckoutSessionController {
	/**
	 * List
	 *
	 * @param \CheckoutEngine/Models/User $user User.
	 * @return array A list of users orders.
	 */
	public function index( $user ) {
		if ( ! $user->customerId() ) {
			return [];
		}

		return \CheckoutEngine::blocks()->render(
			'web.dashboard.orders.index',
			[
				'tab'    => 'orders',
				'orders' => CheckoutSession::where(
					[
						'status'       => [ 'paid', 'completed' ],
						'customer_ids' => [ $user->customerId() ],
					]
				)->with( [ 'line_items' ] )->get(),
			]
		);
	}

	/**
	 * Get single
	 */
	public function show( $id ) {
		return \CheckoutEngine::blocks()->render(
			'web.dashboard.orders.show',
			[
				'tab'   => 'orders',
				'order' => CheckoutSession::with( [ 'line_items', 'line_item.price', 'price.product' ] )->find( $id ),
			]
		);
	}
}
