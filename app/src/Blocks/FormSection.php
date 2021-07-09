<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
class FormSection extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'form-section';

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
			"components/$this->name",
			[
				'attributes' => $attributes,
				'content'    => $content,
			]
		);
	}
}
