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
				'render_callback' => [ $this, 'preRender' ],
				'attributes'      => $this->attributes,
				'parent'          => $this->parent,
			]
		);
	}

	/**
	 * Optionally run a function to modify attibuutes before rendering.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content   Post content.
	 *
	 * @return function
	 */
	public function preRender( $attributes, $content ) {
		// run middlware.
		$render = $this->middleware( $attributes, $content );
		if ( is_wp_error( $render ) ) {
			return $render->get_error_message();
		}
		if ( ! $render ) {
			return false;
		}

		// render
		return $this->render( $attributes, $content );
	}

	/**
	 * Run any block middleware before rendering.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content   Post content.
	 * @return boolean|\WP_Error;
	 */
	protected function middleware( $attributes, $content ) {
		return true;
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
