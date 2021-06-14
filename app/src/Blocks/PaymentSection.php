<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
class PaymentSection extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'payment-section';

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
			'blocks/section-payment',
			[
				'label'       => $attributes['label'] ?? __( 'Payment', 'checkout_engine' ),
				'description' => isset( $attributes['description'] ) ? $attributes['description'] : __( 'This is a secure, encrypted payment', 'checkout_engine' ),
				'attributes'  => $attributes,
				'content'     => $content,
			]
		);
	}
}
