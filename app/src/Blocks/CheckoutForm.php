<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
class CheckoutForm extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'checkout-form';

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		ob_start();
		\CheckoutEngine::render(
			'checkout-block',
			[
				'blocks' => $content,
			]
		);
		return ob_get_clean();
	}
}
