<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
abstract class Block {
	/**
	 * Register the block for dynamic output
	 *
	 * @return void
	 */
	public function register() {
		register_block_type(
			"checkout-engine/$this->name",
			[
				'render_callback' => [ $this, 'render' ],
			]
		);
	}

	/**
	 * Render the block
	 *
	 * @return void
	 */
	public function render( $attributes, $content ) {
	}
}
