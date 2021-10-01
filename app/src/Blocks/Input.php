<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
class Input extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'input';

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
				'label'   => $attributes['label'] ?? '',
				'help'    => $attributes['help'] ?? '',
				'name'    => $attributes['name'] ?? '',
				'content' => $content,
			]
		);
	}
}
