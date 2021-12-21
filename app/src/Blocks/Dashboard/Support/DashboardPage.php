<?php

namespace CheckoutEngine\Blocks\Dashboard\Support;

use CheckoutEngine\Blocks\Block;
use CheckoutEngine\Models\User;

/**
 * Checkout block
 */
abstract class DashboardPage extends Block {
	/**
	 * Holds the customer object.
	 *
	 * @var \CheckoutEngine\Models\Customer|null|\WP_Error;
	 */
	protected $customer = null;

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
		$this->customer = $user->customer();
		if ( is_wp_error( $this->customer ) ) {
			return $this->customer->get_error_message();
		}

		return true;
	}
}
