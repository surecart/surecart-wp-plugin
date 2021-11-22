<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
abstract class Block {
	/**
	 * App Service container
	 *
	 * @var \Pimple\Container
	 */
	protected $container;

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
			"checkout-engine/$this->name",
			[
				'render_callback' => [ $this, 'render' ],
				'attributes'      => [
					'prices' => [
						'type' => 'array',
					],
				],
			]
		);
	}

	/**
	 * Render the block
	 *
	 * @return void
	 */
	public function render( $attributes, $content ) {
	}
}
