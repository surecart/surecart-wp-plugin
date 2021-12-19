<?php

namespace CheckoutEngine\Blocks\Dashboard;

use CheckoutEngine\Blocks\Block;
use CheckoutEngine\Models\CheckoutSession;
use CheckoutEngine\Models\User;

/**
 * Checkout block
 */
class CustomerOrders extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'customer-orders';

	/**
	 * Block attributes
	 *
	 * @var array
	 */
	protected $attributes = [];

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return void
	 */
	public function render( $attributes, $content ) {
		// get the current page tab and possible id.
		$id = intval( $_GET['id'] ?? 0 );

		$user = User::current();
		if ( ! $user ) {
			return;
		}

		if ( $id ) {
			return 'single';
		}

		return $this->index( $attributes, $user );
	}

	public function index( $attributes, $user ) {
		$page = isset( $_GET['current-page'] ) ? sanitize_text_field( wp_unslash( $_GET['current-page'] ) ) : null;

		return \CheckoutEngine::blocks()->render(
			'web.dashboard.orders.index',
			[
				'tab'    => 'orders',
				'orders' => CheckoutSession::where(
					[
						'status'       => [ 'paid', 'completed' ],
						'customer_ids' => [ $user->customerId() ],
					]
				)->with(
					[
						'line_items',
					]
				)->paginate(
					[
						'page'     => $page,
						'per_page' => intval( $attributes['per_page'] ?? 10 ),
					]
				),
			]
		);
	}
}
