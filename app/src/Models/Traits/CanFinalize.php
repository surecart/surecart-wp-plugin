<?php

namespace CheckoutEngine\Models\Traits;

use CheckoutEngine\Models\User;

/**
 * If the model has an attached customer.
 */
trait CanFinalize {
	/**
	 * Finalize the session for checkout.
	 *
	 * @return $this|\WP_Error
	 */
	protected function finalize() {
		if ( $this->fireModelEvent( 'finalizing' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the checkout session.' );
		}

		if ( empty( $this->processor_type ) ) {
			return new \WP_Error( 'no_processor', 'Please provide a processor' );
		}

		$finalized = \CheckoutEngine::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/finalize/',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $finalized ) ) {
			return $finalized;
		}

		$this->resetAttributes();

		$this->fill( $finalized );

		$this->fireModelEvent( 'finalized' );

		$this->maybeAssociateUser();

		return $this;
	}

	/**
	 * Maybe create the WordPress user for the purchase.
	 *
	 * @param string $order_id The order id.
	 * @throws \Exception Throws execption for missing data.
	 *
	 * @return \CheckoutEngine\Models\User;
	 */
	protected function maybeAssociateUser() {
		// requires an order, and a customer email and id.
		if ( empty( $this->attributes['id'] ) ||
			empty( $this->attributes['customer']['email'] ) ||
			empty( $this->attributes['customer']['id'] ) ) {
			return false;
		}

		$customer = $this->attributes['customer'];

		// maybe create the user.
		$user = User::findByCustomerId( $customer['id'] );

		// we already have a user for this order.
		if ( ! empty( $user->ID ) ) {
			return $user;
		}

		// find any existing users.
		$existing = User::getUserBy( 'email', $customer['email'] );
		// If they match.
		if ( $existing && $customer['id'] === $existing->customerId( $this->live_mode ? 'live' : 'test' ) ) {
			return $existing;
		}

		// if no user, create one with a generated password.
		$created = User::create(
			[
				'user_name'  => ! empty( $customer['name'] ) ? $customer['name'] : $customer['email'],
				'user_email' => $customer['email'],
			]
		);

		if ( is_wp_error( $created ) ) {
			return $created;
		}

		// set the customer id.
		$created->setCustomerId( $customer['id'], $this->live_mode ? 'live' : 'test' );

		if ( ! empty( $created->ID ) ) {
			return $created;
		}

		return new \WP_Error( 'user_not_created', __( 'User not created.', 'checkout_engine' ) );
	}
}
