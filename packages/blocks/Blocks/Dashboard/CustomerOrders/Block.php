<?php

namespace CheckoutEngineBlocks\Dashboard\CustomerOrders;

use CheckoutEngine\Models\User;
use CheckoutEngineBlocks\Dashboard\DashboardPage;

/**
 * Checkout block
 */
class Block extends DashboardPage {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return function
	 */
	public function render( $attributes, $content ) {
		// get the current page tab and possible id.
		$id   = sanitize_text_field( $_GET['order']['id'] ?? null );
		$page = sanitize_text_field( $_GET['order']['page'] ?? 1 );

		return $id ? $this->show( $id ) : $this->index( $page );
	}

	/**
	 * Show and individual checkout session.
	 *
	 * @param string $id Session ID.
	 *
	 * @return function
	 */
	public function show( $id ) {
		return \CheckoutEngine::blocks()->render(
			'web/dashboard/orders/show',
			[
				'id'            => $id,
				'order'         => [
					'query' => [
						'expand'       => [],
						'customer_ids' => [ User::current()->customerIds() ],
					],
				],
				'subscriptions' => [
					'query' => [
						'order_ids'    => [ $id ],
						'customer_ids' => [ User::current()->customerIds() ],
						'status'       => [ 'active', 'trialing' ],
						'page'         => 1,
						'per_page'     => 10,
					],
				],
				'charges'       => [
					'query' => [
						'order_ids'    => [ $id ],
						'customer_ids' => [ User::current()->customerIds() ],
						'page'         => 1,
						'per_page'     => 10,
					],
				],
			]
		);
	}

	/**
	 * Show and individual checkout session.
	 *
	 * @param array $page Current page.
	 *
	 * @return function
	 */
	public function index( $page ) {
		if ( ! User::current()->isCustomer() ) {
			return;
		}
		return \CheckoutEngine::blocks()->render(
			'web/dashboard/orders/index',
			[
				'query' => [
					'customer_ids' => User::current()->customerIds(),
					'status'       => [ 'paid' ],
					'page'         => 1,
					'per_page'     => 10,
				],
			]
		);
	}
}
