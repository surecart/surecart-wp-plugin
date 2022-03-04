<?php

namespace CheckoutEngineBlocks\Blocks\Dashboard\CustomerOrders;

use CheckoutEngine\Models\User;
use CheckoutEngineBlocks\Blocks\Dashboard\DashboardPage;
use CheckoutEngineBlocks\Controllers\OrderController;

/**
 * Checkout block
 */
class Block extends DashboardPage {
	/**
	 * Render the preview (overview)
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return function
	 */
	public function render( $attributes, $content ) {
		if ( ! User::current()->isCustomer() ) {
			return;
		}
		return ( new OrderController() )->preview();
	}
}
