<?php

namespace CheckoutEngine\Blocks\Dashboard\CustomerCharges;

use CheckoutEngine\Blocks\Dashboard\DashboardPage;
use CheckoutEngine\Models\Charge;

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
		if ( ! current_user_can( 'read_ce_order', $id ) ) {
			wp_die( 'You do not have permission to access this payment.', 'checkout_engine' );
		}

		$charge = Charge::with( [ 'line_items', 'line_item.price', 'price.product' ] )->find( $id );

		// return \CheckoutEngine::blocks()->render(
		// 'web.dashboard.charges.show',
		// [
		// 'charge' => $charge,
		// ]
		// );
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

		$page = isset( $_GET['current-page'] ) ? sanitize_text_field( wp_unslash( $_GET['current-page'] ) ) : 1;

		// return \CheckoutEngine::blocks()->render(
		// 'web.dashboard.charges.index',
		// [
		// 'tab'     => 'charges',
		// 'charges' => Charge::where(
		// [
		// 'customer_ids' => [ $this->customer->id ],
		// ]
		// )->with(
		// [
		// 'order',
		// 'order.line_items',
		// 'line_item.price',
		// 'subscription',
		// 'subscription.subscription_items',
		// 'subscription_item.price',
		// 'price.product',
		// ]
		// )->paginate(
		// [
		// 'page'     => $page,
		// 'per_page' => intval( $attributes['per_page'] ?? 10 ),
		// ]
		// ),
		// ]
		// );
	}
}
