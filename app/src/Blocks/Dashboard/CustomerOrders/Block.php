<?php

namespace CheckoutEngine\Blocks\Dashboard\CustomerOrders;

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

		// $order = CheckoutSession::with( [ 'line_items', 'line_item.price', 'price.product' ] )->find( $id );

		// return \CheckoutEngine::blocks()->render(
		// 'web.dashboard.orders.show',
		// [
		// 'order' => $order,
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
		if ( empty( $this->customer->id ) ) {
			return; // sanity check.
		}

		$page = isset( $_GET['current-page'] ) ? sanitize_text_field( wp_unslash( $_GET['current-page'] ) ) : 1;

		// return \CheckoutEngine::blocks()->render(
		// 'web.dashboard.orders.index',
		// [
		// 'orders' => CheckoutSession::where(
		// [
		// 'status'       => [ 'paid', 'completed' ],
		// 'customer_ids' => [ $this->customer->id ],
		// ]
		// )->with(
		// [
		// 'line_items',
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
