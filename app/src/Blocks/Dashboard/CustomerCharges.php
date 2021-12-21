<?php

namespace CheckoutEngine\Blocks\Dashboard;

use CheckoutEngine\Blocks\Dashboard\Support\DashboardPage;
use CheckoutEngine\Models\Charge;
use CheckoutEngine\Models\CheckoutSession;
use CheckoutEngine\Models\User;

/**
 * Checkout block
 */
class CustomerCharges extends DashboardPage {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'customer-charges';

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
	 * @return void
	 */
	public function render( $attributes, $content ) {
		// get the current page tab and possible id.
		$id = sanitize_text_field( $_GET['id'] ?? null );
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
	 * @param array $attributes Block attributes.
	 *
	 * @return function
	 */
	public function index( $attributes ) {
		if ( empty( $this->customer->id ) ) {
			return; // sanity check.
		}

		$page = isset( $_GET['current-page'] ) ? sanitize_text_field( wp_unslash( $_GET['current-page'] ) ) : 1;

		return \CheckoutEngine::blocks()->render(
			'web.dashboard.charges.index',
			[
				'tab'     => 'charges',
				'charges' => Charge::where(
					[
						'customer_ids' => [ $this->customer->id ],
					]
				)->with(
					[
						'checkout_session',
						'checkout_session.line_items',
						'line_item.price',
						'subscription',
						'subscription.subscription_items',
						'subscription_item.price',
						'price.product',
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
