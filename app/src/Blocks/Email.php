<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
class Email extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'email';

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
				'label'       => $attributes['label'] ?? __( 'Email Address', 'checkout_engine' ),
				'description' => $attributes['description'] ?? '',
			]
		);
	}
}
