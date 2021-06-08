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
				'label'       => $attributes['label'] ?? __( 'Choose A Plan', 'checkout_engine' ),
				'description' => $attributes['description'] ?? '',
				'type'        => $attributes['type'] ?? 'radio',
				'prices'      => [
					[
						'name'        => 'price',
						'value'       => 'gold',
						'required'    => true,
						'default'     => true,
						'title'       => 'Gold Plan',
						'description' => '$9.99, then $49.99 per month',
					],
					[
						'name'        => 'price',
						'value'       => 'silver',
						'required'    => true,
						'title'       => 'Silver Plan',
						'description' => '$9.99, then $49.99 per month',
					],
				],
				'attributes'  => $attributes,
				'content'     => $content,
			]
		);
	}
}
