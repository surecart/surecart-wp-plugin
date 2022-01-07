<?php

namespace CheckoutEngine\Controllers\Web\Dashboard;

use CheckoutEngine\Models\Charge;

/**
 * Customer order controller
 */
class CustomerChargesController {
	/**
	 * Get a users list
	 *
	 * @param \CheckoutEngine/Models/User $user User.
	 * @return array A list of users orders.
	 */
	public function index( $user ) {
		if ( ! $user->customerId() ) {
			return [];
		}

		return \CheckoutEngine::blocks()->render(
			'web.dashboard.charges.index',
			[
				'tab'     => 'charges',
				'charges' => Charge::where(
					[
						'customer_ids' => [ $user->customerId() ],
					]
				)->with( [ 'order', 'order.line_items', 'line_item.price', 'subscription', 'subscription.subscription_items', 'subscription_item.price', 'price.product' ] )->get(),
			]
		);
	}

	/**
	 * Get a users single.
	 */
	public function get( $id ) {
		return \CheckoutEngine::blocks()->render(
			'web.dashboard.charges.show',
			[
				'tab'    => 'charges',
				'charge' => Charge::with( [ 'subscription_items', 'subscription_item.price', 'price.product' ] )->find( $id ),
			]
		);
	}
}
