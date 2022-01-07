<?php

namespace CheckoutEngine\Controllers\Web\Dashboard;

use CheckoutEngine\Models\Order;

/**
 * Customer order controller
 */
class CustomerOrderController {
	/**
	 * List
	 *
	 * @param \CheckoutEngine/Models/User $user User.
	 * @return array A list of users orders.
	 */
	public function index( $user, $page = 1 ) {
		if ( ! $user->customerId() ) {
			return [];
		}

		return \CheckoutEngine::blocks()->render(
			'web.dashboard.orders.index',
			[
				'tab'    => 'orders',
				'orders' => Order::where(
					[
						// 'status'       => [ 'paid', 'completed' ],
						'customer_ids' => [ $user->customerId() ],
					]
				)->with(
					[
						'line_items',
					]
				)->paginate(
					[
						'page'     => $page,
						'per_page' => 5,
					]
				),
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
				'order' => Order::with( [ 'line_items', 'line_item.price', 'price.product' ] )->find( $id ),
			]
		);
	}
}
