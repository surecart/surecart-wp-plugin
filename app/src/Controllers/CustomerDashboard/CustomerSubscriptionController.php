<?php

namespace CheckoutEngine\Controllers\CustomerDashboard;

use CheckoutEngine\Models\Subscription;

/**
 * Customer order controller
 */
class CustomerSubscriptionController {
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
			'web.dashboard.subscriptions.index',
			[
				'tab'           => 'subscriptions',
				'subscriptions' => Subscription::where(
					[
						'customer_ids' => [ $user->customerId() ],
					]
				)->with( [ 'subscription_items' ] )->get(),
			]
		);
	}

	/**
	 * Get a users single.
	 */
	public function get( $id ) {
		return \CheckoutEngine::blocks()->render(
			'web.dashboard.subscriptions.show',
			[
				'tab'   => 'orders',
				'order' => Subscription::with( [ 'subscription_items', 'subscription_item.price', 'price.product' ] )->find( $id ),
			]
		);
	}
}
