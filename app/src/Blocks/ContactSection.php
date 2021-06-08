<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
class ContactSection extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'contact-section';

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
				'label'       => $attributes['label'] ?? __( 'Contact Information', 'checkout_engine' ),
				'description' => $attributes['description'] ?? '',
				'content'     => $content,
			]
		);
	}
}
