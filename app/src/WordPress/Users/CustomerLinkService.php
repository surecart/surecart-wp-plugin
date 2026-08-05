<?php

namespace SureCart\WordPress\Users;

use SureCart\Models\Customer;
use SureCart\Models\User;

/**
 * WordPress Users service.
 */
class CustomerLinkService {
	/**
	 * Holds a password.
	 *
	 * @var string
	 */
	protected $password_hash = '';

	/**
	 * Holds the model for the link.
	 *
	 * @var \SureCart\Models\Checkout
	 */
	protected $checkout;

	/**
	 * Get things going.
	 *
	 * @param \SureCart\Models\Checkout $checkout Model for the link.
	 * @param string                    $password_hash The password.
	 */
	public function __construct( \SureCart\Models\Checkout $checkout, $password_hash = '' ) {
		$this->checkout      = $checkout;
		$this->password_hash = $password_hash;
	}

	/**
	 * Link the user to the checkout.
	 *
	 * @return \SureCart\Models\User|\WP_Error|false
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

		// create a user to link.
		return $this->linkNewUser();
	}

	/**
	 * Find the user by customer id.
	 *
	 * @return \SureCart\Models\User|false
	 */
	protected function getLinked() {
		return User::findByCustomerId( $this->checkout->customer_id );
	}

	/**
	 * Link a user with email.
	 *
	 * @return \SureCart\Models\User|false
	 */
	protected function linkUserWithEmail() {
		// next check if email has a user.
		$existing = User::getUserBy( 'email', $this->checkout->email );

		// no user for this email.
		if ( ! $existing ) {
			return false;
		}

		$mode = ! empty( $this->checkout->live_mode ) ? 'live' : 'test';

		// the user already has a customer id for this mode.
		if ( $existing->customerId( $mode ) ) {
			return false;
		}

		// the checkout's email and customer are independently attacker-controlled — only link when the customer record's own email matches this user.
		$customer_email = $this->getCustomerEmail();
		if ( empty( $customer_email ) ) {
			error_log( 'SureCart: Could not determine the customer email for checkout ' . $this->checkout->id . ' - refusing to link a user by email.' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			return false;
		}
		if ( strtolower( $customer_email ) !== strtolower( $existing->user_email ) ) {
			error_log( 'SureCart: Customer ' . $this->checkout->customer_id . ' email does not match the user matched by checkout ' . $this->checkout->id . ' email - refusing to link.' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			return false;
		}

		// a failed link (e.g. the id is already held by another user) must not report success.
		$linked = $existing->setCustomerId( $this->checkout->customer_id, $mode );
		if ( is_wp_error( $linked ) ) {
			error_log( 'SureCart: Could not link customer ' . $this->checkout->customer_id . ' for checkout ' . $this->checkout->id . ' - ' . $linked->get_error_message() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			return false;
		}

		return $existing;
	}

	/**
	 * Get the checkout customer's email, fetching the customer when not expanded.
	 *
	 * @return string|null
	 */
	protected function getCustomerEmail() {
		$email = $this->checkout->customer->email ?? null;
		if ( ! empty( $email ) ) {
			return $email;
		}

		// not expanded (or expanded without an email) — fetch by id so the link is justified by platform data, failing closed only as a last resort.
		$id = $this->checkout->customer_id;
		if ( is_string( $id ) && ! empty( $id ) ) {
			$customer = Customer::find( $id );
			if ( ! is_wp_error( $customer ) && ! empty( $customer->email ) ) {
				return $customer->email;
			}
		}

		return null;
	}

	/**
	 * Create the user and link it.
	 *
	 * @return \SureCart\Models\User|\WP_Error|false
	 */
	protected function linkNewUser() {
		global $wpdb;

		if ( email_exists( $this->checkout->customer->email ?? $this->checkout->email ?? null ) ) {
			return false;
		}

		// if no user, create one with a password if provided.
		$created = User::create(
			array(
				'user_name'  => $this->checkout->customer->name ?? $this->checkout->name ?? null,
				'user_email' => $this->checkout->customer->email ?? $this->checkout->email ?? null,
				'first_name' => $this->checkout->customer->first_name ?? null,
				'last_name'  => $this->checkout->customer->last_name ?? null,
				'phone'      => $this->checkout->customer->phone ?? null,
			)
		);

		// bail if error.
		if ( is_wp_error( $created ) ) {
			return $created;
		}

		// update the user's password hash if set.
		if ( $this->password_hash ) {
			$wpdb->update(
				$wpdb->users,
				array(
					'user_pass'           => $this->password_hash,
					'user_activation_key' => '',
				),
				array( 'ID' => $created->ID )
			);
			clean_user_cache( $created->ID );
			update_user_meta( $created->ID, 'default_password_nag', false );
		}

		// login the user.
		if ( apply_filters( 'surecart/checkout/auto-login-new-user', true ) ) {
			$created->login();
		}

		// set the customer id for the user.
		return $created->setCustomerId( $this->checkout->customer->id ?? $this->checkout->customer, ! empty( $this->checkout->live_mode ) ? 'live' : 'test' );
	}
}
