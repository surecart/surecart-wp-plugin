<?php

namespace CheckoutEngine\Blocks;

use CheckoutEngine\Concerns\HasBlockTheme;

/**
 * Checkout block
 */
class CheckoutFormPost extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'checkout-post';

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		var_dump( 'hello' );
		return \CheckoutEngine::blocks()->render(
			"blocks/$this->name",
			[
				'instance' => self::$instance++,
			]
		);
	}
}
