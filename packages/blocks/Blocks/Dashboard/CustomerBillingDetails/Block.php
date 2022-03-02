<?php

namespace CheckoutEngineBlocks\Blocks\Dashboard\CustomerBillingDetails;

use CheckoutEngineBlocks\Blocks\Dashboard\DashboardPage;
use CheckoutEngineBlocks\Controllers\CustomerController;

/**
 * Checkout block
 */
class Block extends DashboardPage {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return function
	 */
	public function render( $attributes, $content ) {
		return ( new CustomerController() )->show( $attributes, $content );
	}
}
