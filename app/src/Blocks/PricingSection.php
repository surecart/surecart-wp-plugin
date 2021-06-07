<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
class PricingSection extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'pricing-section';

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
				'attributes' => $attributes,
				'content'    => $content,
			]
		);
	}
}
