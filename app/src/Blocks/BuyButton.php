<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
class BuyButton extends Block {

	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'buy-button';

	/**
	 * Register the block for dynamic output
	 *
	 * @param \Pimple\Container $container Service container.
	 *
	 * @return void
	 */
	public function register( $container ) {
		$this->container = $container;

		register_block_type(
			'checkout-engine/buy-button',
			[
				'apiVersion'      => 2,
				'name'            => 'checkout-engine/buy-button',
				'title'           => __( 'Buy Button', 'checkout_engine' ),
				'description'     => __( 'Display a button to immediately redirect to the checkout page with the product in the cart.', 'checkout_engine' ),
				'category'        => 'layout',
				'keywords'        => [ 'buy', 'product', 'price' ],
				'supports'        => [
					'reusable' => false,
					'html'     => false,
				],
				'attributes'      => [
					'label'      => [
						'type' => 'string',
					],
					'type'       => [
						'type'    => 'string',
						'default' => 'primary',
					],
					'size'       => [
						'type'    => 'string',
						'default' => 'medium',
					],
					'line_items' => [
						'type' => 'array',
					],
					'custom_url' => [
						'type' => 'string',
					],
				],
				'render_callback' => [ $this, 'render' ],
			]
		);
	}

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
				'type'  => $attributes['type'] ?? 'primary',
				'size'  => $attributes['size'] ?? 'medium',
				'href'  => add_query_arg(
					[
						'line_items' => array_map(
							function( $item ) {
								return [
									'price_id' => $item['id'],
									'quantity' => $item['quantity'],
								];
							},
							$attributes['line_items'] ?? []
						),
					],
					\CheckoutEngine::pages()->url( 'checkout' )
				),
				'label' => $attributes['label'] ?? __( 'Buy Now', 'checkout_session' ),
			]
		);
	}
}
