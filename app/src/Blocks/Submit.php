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
	 * @return void
	 */
	public function render( $attributes, $content ) {
		\CheckoutEngine::render(
			'block',
			[
				'attributes' => $attributes,
			]
		);
	}
}
