<?php

namespace CheckoutEngineBlocks\Blocks\Dashboard\CustomerDownloads;

use CheckoutEngine\Models\User;
use CheckoutEngineBlocks\Blocks\Dashboard\DashboardPage;
use CheckoutEngineBlocks\Controllers\DownloadController;

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
		return ( new DownloadController() )->preview( $attributes );
	}
}
