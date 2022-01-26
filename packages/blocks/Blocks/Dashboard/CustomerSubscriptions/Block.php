<?php

namespace CheckoutEngine\Blocks\Dashboard\CustomerSubscriptions;

use CheckoutEngine\Blocks\Dashboard\DashboardPage;

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
		$id = sanitize_text_field( $_GET['subscription']['id'] ?? null );
		return $id ? $this->show( $id ) : $this->index( $attributes );
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
			'web/dashboard/subscriptions/show',
			[
				'id' => $id,
			]
		);
	}

	/**
	 * Show and individual checkout session.
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return function
	 */
	public function index( $attributes ) {
		if ( empty( $this->customer_id ) ) {
			return; // sanity check.
		}

		$page = isset( $_GET['subscription']['page'] ) ? intval( wp_unslash( $_GET['subscription']['page'] ) ) : 1;

		return \CheckoutEngine::blocks()->render(
			'web/dashboard/subscriptions/index',
			[
				'customer_id'     => $this->customer_id,
				'cancel_behavior' => 'cancel',
				'empty'           => __( 'You have no subscriptions.', 'checkout-engine' ),
				'query'           => [
					'customer_ids' => [ $this->customer_id ],
					'status'       => [ 'active', 'trialing' ],
					'page'         => 1,
					'per_page'     => 10,
				],
			]
		);
	}
}
