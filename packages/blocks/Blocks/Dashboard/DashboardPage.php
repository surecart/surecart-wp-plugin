<?php

namespace CheckoutEngine\Blocks\Dashboard;

use CheckoutEngine\Blocks\BaseBlock;
use CheckoutEngine\Models\User;

/**
 * Checkout block
 */
abstract class DashboardPage extends BaseBlock {
	/**
	 * Holds the customer object.
	 *
	 * @var \CheckoutEngine\Models\Customer|null|\WP_Error;
	 */
	protected $customer = null;

	/**
	 * Holds the customer id.
	 *
	 * @var string
	 */
	protected $customer_id = null;

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

		$this->customer_id = $user->customerId();

		// user must be a customer.
		if ( ! $this->customer_id ) {
			$this->customer = $user->customer();
			if ( is_wp_error( $this->customer ) ) {
				return $this->customer->get_error_message();
			}
			if ( ! $this->customer ) {
				return '<ce-alert type="error" open>' . esc_html__( 'You must be a customer to access this page.', 'checkout-engine' ) . '</ce-alert>';
			}
		}

		return true;
	}
}
