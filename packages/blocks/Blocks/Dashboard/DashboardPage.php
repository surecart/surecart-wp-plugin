<?php

namespace SureCartBlocks\Blocks\Dashboard;

use SureCartBlocks\Blocks\BaseBlock;
use SureCart\Models\User;

/**
 * Checkout block
 */
abstract class DashboardPage extends BaseBlock {
	/**
	 * Holds the customer object.
	 *
	 * @var \SureCart\Models\Customer|null|\WP_Error;
	 */
	protected $customer = null;

	/**
	 * Holds the customer id.
	 *
	 * @var string
	 */
	protected $customer_id = null;

	/**
	 * Get the current tab.
	 */
	protected function getTab() {
		return isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : false;
	}

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

		if ( ! $user->isCustomer() ) {
			return '<ce-alert type="error" open>' . esc_html__( 'You must be a customer to access this page.', 'surecart' ) . '</ce-alert>';
		}

		return true;
	}
}
