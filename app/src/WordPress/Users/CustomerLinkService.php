<?php

namespace SureCart\WordPress\Users;

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
	 * @return \SureCart\Models\User|\WP_Error
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

		// We have a user, link it.
		if ( $existing ) {
			$mode = ! empty( $this->checkout->live_mode ) ? 'live' : 'test';
			// maybe add the customer id for the user if it's not yet set.
			if ( ! $existing->customerId( $mode ) ) {
				$existing->setCustomerId( $this->checkout->customer_id, $mode );
				return $existing;
			}
			error_log( 'Andre Error: Attempted to set customer id, but the user already has one.' );
			error_log( print_r( $existing, 1 ) );
			error_log( print_r( $this->checkout, 1 ) );
		}

		return false;
	}

	/**
	 * Create the user and link it.
	 *
	 * @return \SureCart\Models\User|\WP_Error
	 */
	protected function linkNewUser() {
		global $wpdb;

		// if no user, create one with a password if provided.
		$created = User::create(
			[
				'user_name'  => ! empty( $this->checkout->name ) ? $this->checkout->name : null,
				'user_email' => $this->checkout->email,
			]
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
		} else {
			// add to the user account that they have a generated password.
			update_user_meta( $created->ID, 'sc_generated_password', true );
		}

		// get the mode string.
		$mode = ! empty( $this->checkout->live_mode ) ? 'live' : 'test';

		// login the user.
		if ( apply_filters( 'surecart/checkout/auto-login-new-user', true ) ) {
			$this->loginUser( $created );
		}

		// set the customer id for the user.
		return $created->setCustomerId( $this->checkout->customer_id, $mode );
	}

	/**
	 * Login ths user
	 *
	 * @param \SureCart\Models\User $user The user model.
	 *
	 * @return void
	 */
	public function loginUser( \SureCart\Models\User $user ) {
		clean_user_cache( $user->ID );
		wp_clear_auth_cookie();
		wp_set_current_user( $user->ID );
		wp_set_auth_cookie( $user->ID, true, false );
		update_user_caches( $user->getUser() );
	}
}
