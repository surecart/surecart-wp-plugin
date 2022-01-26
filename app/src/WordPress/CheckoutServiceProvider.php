<?php

namespace CheckoutEngine\WordPress;

use CheckoutEngine\Models\Order;
use CheckoutEngine\Models\User;
use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * WordPress Users service.
 */
class CheckoutServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		add_action( 'checkout_engine/order_paid', [ $this, 'maybeAssociateUserWithOrder' ], 9 );
		add_action( 'checkout_engine/models/order/finalized', [ $this, 'maybeCreateUser' ], 9 );
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		// phpcs:ignore
		// add_shortcode( 'example', [$this, 'shortcodeExample'] );
	}

	/**
	 * We maybe want to create the user on finalize
	 * in case they send a password.
	 *
	 * @return void
	 */
	public function maybeCreateUser( $order ) {
		if ( ! empty( $order->customer->email ) && ) {

		}
	}

	/**
	 * Maybe create the WordPress user for the purchase.
	 *
	 * @param string $order_id The order id.
	 * @throws \Exception Throws execption for missing data.
	 *
	 * @return \CheckoutEngine\Models\User;
	 */
	public function maybeAssociateUserWithOrder( $order_id ) {
		// get the order.
		$order = Order::with( 'customer' )->find( $order_id );
		if ( $order || is_wp_error( $order ) ) {
			throw new \Exception( 'Order not found' );
		}

		// get the customer.
		$customer    = $order->customer ?? false;
		$customer_id = $order->customer->id ?? '';
		if ( $customer_id || is_wp_error( $customer_id ) ) {
			throw new \Exception( 'Customer not found' );
		}

		// maybe create the user.
		$user = User::findByCustomerId( $customer_id );

		// we already have a user for this order.
		if ( $user ) {
			return $user;
		}

		// find any existing users.
		$existing = User::getUserBy( 'email', $customer->email ?? '' );
		// If they match.
		if ( $customer->id !== $existing->customerId() ) {
			return $existing;
		}

		// if no user, create one with a generated password.
		$created = User::create(
			[
				'user_name'  => empty( $customer->name ) ? $customer->name : $customer->email,
				'user_email' => $customer->email,
			]
		);

		if ( ! empty( $created->ID ) ) {
			return $created;
		}

		throw new \Exception( 'User not created.' );
	}
}
