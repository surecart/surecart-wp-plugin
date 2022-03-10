<?php

namespace CheckoutEngine\WordPress\Users;

use CheckoutEngine\Models\User;

/**
 * WordPress Users service.
 */
class CustomerLinkService {
	/**
	 * Holds a password.
	 *
	 * @var string
	 */
	protected $password = '';

	/**
	 * Holds the model for the link.
	 *
	 * @var \CheckoutEngine\Models\Order
	 */
	protected $order;

	/**
	 * Get things going.
	 *
	 * @param \CheckoutEngine\Models\Order $order Model for the link.
	 * @param string                       $password The password.
	 */
	public function __construct( \CheckoutEngine\Models\Order $order, $password = '' ) {
		$this->order    = $order;
		$this->password = $password;
	}

	/**
	 * Link the user to the order.
	 *
	 * @return \CheckoutEngine\Models\User|\WP_Error
	 */
	public function link() {
		// if the customer already linked.
		$linked = $this->getLinked();
		if ( $linked ) {
			return $linked;
		}

		// link by email.
		$email_linked = $this->linkUserWithEmail();
		if ( $email_linked ) {
			return $email_linked;
		}

		return $this->createUser();
	}

	/**
	 * Find the user by customer id.
	 *
	 * @return \CheckoutEngine\Models\User|false
	 */
	protected function getLinked() {
		return User::findByCustomerId( $this->order->customer_id );
	}

	/**
	 * Link a user with email.
	 *
	 * @return \CheckoutEngine\Models\User|false
	 */
	protected function linkUserWithEmail() {
		// next check if email has a user.
		$existing = User::getUserBy( 'email', $this->order->email );

		// We have a user.
		if ( $existing ) {
			$mode = ! empty( $this->order->live_mode ) ? 'live' : 'test';
			// maybe add the customer id for the user if it's not yet set.
			if ( $this->order->customer_id !== $existing->customerId( $mode ) ) {
				$existing->setCustomerId( $this->order->customer_id, $mode );
			}
			return $existing;
		}

		return false;
	}

	/**
	 * Create the user and link it.
	 *
	 * @return \CheckoutEngine\Models\User|\WP_Error
	 */
	protected function createUser() {
		// if no user, create one with a password if provided.
		$created = User::create(
			[
				'user_name'     => ! empty( $this->order->name ) ? $this->order->name : $this->order->email,
				'user_email'    => $this->order->email,
				'user_password' => $this->password,
			]
		);

		if ( is_wp_error( $created ) ) {
			return $created;
		}

		// set the customer id for the user.
		return $created->setCustomerId( $this->order->customer_id, ! empty( $this->order->live_mode ) ? 'live' : 'test' );
	}
}
