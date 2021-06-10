<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
class Submit extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'submit';

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		return \CheckoutEngine::blocks()->render(
			"blocks/$this->name",
			[
				'text'   => $attributes['text'] ?? __( 'Purchase', 'checkout_engine' ),
				'type'   => $attributes['type'] ?? 'primary',
				'size'   => $attributes['size'] ?? 'large',
				'full'   => true,
				'submit' => true,
			]
		);
	}
}
