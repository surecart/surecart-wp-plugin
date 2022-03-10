<?php

namespace CheckoutEngineBlocks\Blocks\Dashboard\WordPressAccount;

use CheckoutEngineBlocks\Blocks\Dashboard\DashboardPage;
use CheckoutEngineBlocks\Controllers\UserController;

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
		return ( new UserController() )->show( $attributes, $content );
	}
}
