<?php

namespace CheckoutEngineBlocks\Blocks\Dashboard\CustomerOrders;

use CheckoutEngine\Models\User;
use CheckoutEngineBlocks\Blocks\Dashboard\DashboardPage;

/**
 * Checkout block
 */
class Block extends DashboardPage {
	/**
	 * Render the preview (overview)
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return function
	 */
	public function render( $attributes, $content ) {
		if ( ! User::current()->isCustomer() ) {
			return;
		}
		\CheckoutEngine::assets()->addComponentData(
			'ce-orders-list',
			'#customer-orders-index',
			[
				'listTitle' => $this->attributes['title'] ?? __( 'Order History', 'checkout-engine' ),
				'query'     => [
					'customer_ids' => array_values( User::current()->customerIds() ),
					'status'       => [ 'paid' ],
					'page'         => 1,
					'per_page'     => 5,
				],
			]
		);
		return '<ce-orders-list id="customer-orders-index"></ce-orders-list>';
	}

	/**
	 * Show and individual checkout session.
	 *
	 * @return function
	 */
	public function show() {
		$id = isset( $_GET['id'] ) ? sanitize_text_field( wp_unslash( $_GET['id'] ) ) : false;
		return \CheckoutEngine::blocks()->render(
			'web/dashboard/orders/show',
			[
				'id'            => $id,
				'back_url'      => add_query_arg(
					[
						'tab' => $this->getTab(),
					],
					\CheckoutEngine::pages()->url( 'dashboard' )
				),
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
		\CheckoutEngine::assets()->addComponentData(
			'ce-orders-list',
			'#customer-orders-index',
			[
				'listTitle' => $this->attributes['title'] ?? __( 'Order History', 'checkout-engine' ),
				'query'     => [
					'customer_ids' => array_values( User::current()->customerIds() ),
					'status'       => [ 'paid' ],
					'page'         => 1,
					'per_page'     => 10,
				],
			]
		);
		return '<ce-orders-list id="customer-orders-index"></ce-orders-list>';
	}
}
