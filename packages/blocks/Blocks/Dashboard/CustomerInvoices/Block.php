<?php

namespace CheckoutEngineBlocks\Blocks\Dashboard\CustomerInvoices;

use CheckoutEngineBlocks\Blocks\Dashboard\DashboardPage;
use CheckoutEngineBlocks\Controllers\InvoiceController;

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
		return ( new InvoiceController() )->preview( $attributes );
	}
}
