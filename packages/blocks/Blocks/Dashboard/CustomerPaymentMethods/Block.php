<?php

namespace CheckoutEngineBlocks\Blocks\Dashboard\CustomerPaymentMethods;

use CheckoutEngine\Models\User;
use CheckoutEngineBlocks\Blocks\Dashboard\DashboardPage;

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
		$id   = sanitize_text_field( $_GET['payment_methods']['id'] ?? null );
		$page = sanitize_text_field( $_GET['payment_methods']['page'] ?? 1 );

		return $id ? $this->show( $attributes, $content ) : $this->index( $attributes, $content );
	}

	/**
	 * Show and individual checkout session.
	 *
	 * @param string $id Session ID.
	 *
	 * @return function
	 */
	public function show( $attributes, $content ) {
		return \CheckoutEngine::blocks()->render(
			'web/dashboard/payment-methods/show',
			[
				'id'            => $id,
				'customer_id'   => $this->customer_id,
				'order'         => [
					'query' => [
						'expand' => [],
					],
				],
				'subscriptions' => [
					'query' => [
						'order_ids'    => [ $id ],
						'customer_ids' => [ $this->customer_id ],
						'status'       => [ 'active', 'trialing' ],
						'page'         => 1,
						'per_page'     => 10,
					],
				],
				'charges'       => [
					'query' => [
						'order_ids'    => [ $id ],
						'customer_ids' => [ $this->customer_id ],
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
	public function index( $attributes, $content ) {
		if ( ! User::current()->isCustomer() ) {
			return;
		}
		\CheckoutEngine::assets()->addComponentData(
			'ce-orders-list',
			'#ce-payment-methods-list',
			[
				'listTitle' => $attributes['title'] ?? __( 'Payment Methods', 'checkout-engine' ),
				'query'     => [
					'customer_ids' => array_values( User::current()->customerIds() ),
					'page'         => 1,
					'per_page'     => 5,
				],
			]
		);
		return '<ce-payment-methods-list id="ce-payment-methods-list"></ce-payment-methods-list>';
	}
}
