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
		var_dump( $attributes );
		return '';
		// return \CheckoutEngine::blocks()->render(
		// "blocks/$this->name",
		// [
		// 'label'       => $attributes['label'] ?? __( 'Email Address', 'checkout_engine' ),
		// 'description' => $attributes['description'] ?? '',
		// ]
		// );
	}
}
