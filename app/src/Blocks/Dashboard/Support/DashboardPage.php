<?php

namespace CheckoutEngine\Blocks\Dashboard\Support;

use CheckoutEngine\Blocks\Block;
use CheckoutEngine\Models\User;

/**
 * Checkout block
 */
abstract class DashboardPage extends Block {
	/**
	 * Run middleware before rendering the block.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content   Post content.
	 * @return boolean|\WP_Error;
	 */
	protected function middleware( $attributes, $content ) {
		// user must be logged in.
		if ( ! is_user_logged_in() ) {
			return false;
		}

		// cannot get user.
		$user = User::current();
		if ( ! $user ) {
			return false;
		}

		// user must be a customer.
		$customer = $user->customer();
		if ( is_wp_error( $customer ) ) {
			return $customer->get_error_message();
		}

		return true;
	}
}
