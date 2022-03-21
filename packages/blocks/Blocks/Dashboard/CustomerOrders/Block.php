<?php

namespace SureCartBlocks\Blocks\Dashboard\CustomerOrders;

use SureCart\Models\User;
use SureCartBlocks\Blocks\Dashboard\DashboardPage;
use SureCartBlocks\Controllers\OrderController;

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
		return ( new OrderController() )->preview( $attributes );
	}
}
