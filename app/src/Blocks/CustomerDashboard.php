<?php

namespace CheckoutEngine\Blocks;

use CheckoutEngine\Controllers\Web\Dashboard\CustomerCheckoutSessionController;
use CheckoutEngine\Controllers\Web\Dashboard\CustomerSubscriptionController;
use CheckoutEngine\Controllers\Web\Dashboard\CustomerChargesController;
use CheckoutEngine\Models\User;

/**
 * Checkout block
 */
class CustomerDashboard extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'customer-dashboard';

	/**
	 * Block attributes
	 *
	 * @var array
	 */
	protected $attributes = [];

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		if ( ! is_user_logged_in() ) {
			return \CheckoutEngine::blocks()->render( 'web.login' );
		}
		return $content;
	}
}
