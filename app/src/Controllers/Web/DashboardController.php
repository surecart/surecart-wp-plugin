<?php

namespace CheckoutEngine\Controllers\Web;

use CheckoutEngine\Models\Customer;
use CheckoutEngine\Models\CustomerLink;
use CheckoutEngine\Models\Subscription;
use CheckoutEngine\Models\User;

/**
 * Thank you routes
 */
class DashboardController {
	/**
	 * Show the dashboard
	 */
	public function show( $request, $view ) {
		$link_id = $request->query( 'customer_link_id' );

		// use original page view if no customer link id is found.
		if ( ! $link_id ) {
			return \CheckoutEngine::view( $view );
		}

		// get the customer link by id.
		$link = CustomerLink::find( $link_id );
		if ( is_wp_error( $link ) ) {
			return $this->error( $link );
		}

		// login the user using the customer id from the link.
		$this->loginUser( $link->getUser() );

		$dashboard_url = \CheckoutEngine::pages()->url( 'dashboard' );
		return \CheckoutEngine::redirect()->to( $dashboard_url );
	}

	/**
	 * Handle errors.
	 *
	 * @param \WP_Error $error Error.
	 * @return wp_die
	 */
	public function error( $error ) {
		if ( $error->get_error_code() === 'customer_link.expired' ) {
			return wp_die( esc_html__( 'This link has expired.', 'checkout_engine' ) );
		}
		return wp_die( $error->get_error_message() );
	}

	/**
	 * Get the link from the request.
	 *
	 * @param string $link_id The link id.
	 * @return string|function
	 */
	public function getLink( $link_id ) {
		$link = CustomerLink::find( $link_id );
		if ( is_wp_error( $link ) ) {
			return $this->error( $link );
		}
		return $link;
	}

	/**
	 * Login the user
	 *
	 * @param int|\WP_User $wp_user WordPress user.
	 * @return void
	 */
	public function loginUser( $wp_user ) {
		if ( ! $wp_user ) {
			return wp_die( esc_html__( 'This user could not be found.', 'checkout_engine' ) );
		}

		$id = is_a( $wp_user, '\WP_User' ) ? $wp_user->ID : $wp_user;

		wp_clear_auth_cookie();
		wp_set_current_user( $id );
		wp_set_auth_cookie( $id );
	}
}
