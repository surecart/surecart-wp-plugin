<?php

namespace CheckoutEngine\Blocks\Dashboard;

use CheckoutEngine\Blocks\Dashboard\Support\DashboardPage;
use CheckoutEngine\Models\CheckoutSession;

/**
 * Checkout block
 */
class CustomerSubscriptions extends DashboardPage {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'customer-subscriptions';

	/**
	 * Block attributes
	 *
	 * @var array
	 */
	protected $attributes = [
		'per_page' => [
			'type'    => 'integer',
			'default' => 10,
		],
	];

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return function
	 */
	public function render( $attributes, $content ) {
		$page = isset( $_GET['subscription']['page'] ) ? intval( wp_unslash( $_GET['subscription']['page'] ) ) : 1;
		return \CheckoutEngine::blocks()->render(
			'web.dashboard.subscriptions.index',
			[
				'customer_id'     => $this->customer_id,
				'cancel_behavior' => 'cancel',
				'page'            => (int) $page,
			]
		);

		// get the current page tab and possible id.
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
			'web.dashboard.subscriptions.show',
			[
				'customer_id' => $this->customer_id,
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

		return \CheckoutEngine::blocks()->render(
			'web.dashboard.subscriptions.index',
			[
				'customer_id'     => $this->customer_id,
				'cancel_behavior' => 'cancel',
				'page'            => (int) $page,
			]
		);
	}
}
