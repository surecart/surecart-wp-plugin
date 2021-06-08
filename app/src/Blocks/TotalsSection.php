<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
class TotalsSection extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'totals-section';

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
			'blocks/section-totals',
			[
				'label'       => $attributes['label'] ?? __( 'Totals', 'checkout_engine' ),
				'description' => $attributes['description'] ?? '',
			]
		);
	}
}
