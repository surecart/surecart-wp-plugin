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
		$id = sanitize_text_field( $_GET['id'] ?? null );

		$user = User::current();
		if ( ! $user ) {
			return;
		}

		$customer = $user->customer();
		if ( is_wp_error( $customer ) ) {
			return $customer->get_error_message();
		}

		return $id ? $this->show( $id, $customer ) : $this->index( $attributes, $customer );
	}

	/**
	 * Show and individual checkout session.
	 *
	 * @param string                          $id Session ID.
	 * @param \CheckoutEngine\Models\Customer $customer Customer.
	 *
	 * @return function
	 */
	public function show( $id, $customer ) {
		// check permissions.
		if ( ! current_user_can( 'read_pk_checkout_session', $id ) ) {
			wp_die( 'You do not have permission to access this order.', 'checkout_engine' );
		}

		$order = CheckoutSession::with( [ 'line_items', 'line_item.price', 'price.product' ] )->find( $id );

		return \CheckoutEngine::blocks()->render(
			'web.dashboard.orders.show',
			[
				'order' => $order,
			]
		);
	}

	/**
	 * Show and individual checkout session.
	 *
	 * @param array                           $attributes Block attributes.
	 * @param \CheckoutEngine\Models\Customer $customer Customer.
	 *
	 * @return function
	 */
	public function index( $attributes, $customer ) {
		$page = isset( $_GET['current-page'] ) ? sanitize_text_field( wp_unslash( $_GET['current-page'] ) ) : 1;

		return \CheckoutEngine::blocks()->render(
			'web.dashboard.orders.index',
			[
				'orders' => CheckoutSession::where(
					[
						'status'       => [ 'paid', 'completed' ],
						'customer_ids' => [ $customer->id ],
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
