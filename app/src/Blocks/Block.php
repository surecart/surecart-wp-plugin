<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
abstract class Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = '';
	/**
	 * Parent blocks.
	 *
	 * @var array|null
	 */
	protected $parent = null;

	/**
	 * Block attributes
	 *
	 * @var array
	 */
	protected $attributes = [];

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
				'attributes'      => $this->attributes,
				'parent'          => $this->parent,
			]
		);
	}

	/**
	 * Render the block.
	 *
	 * @return function
	 */
	public function render( $attributes, $content ) {
		return \CheckoutEngine::blocks()->render(
			"blocks/$this->name",
		);
	}
}
