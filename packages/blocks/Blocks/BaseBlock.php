<?php

namespace CheckoutEngineBlocks;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Checkout block
 */
abstract class BaseBlock implements ServiceProviderInterface {
	/**
	 * App Service container
	 *
	 * @var \Pimple\Container
	 */
	protected $container;

	/**
	 * Optional directory to .json block data files.
	 *
	 * @var string
	 */
	protected $directory = '';

	/**
	 * Register the block for dynamic output
	 *
	 * @param \Pimple\Container $container Service container.
	 *
	 * @return void
	 */
	public function register( $container ) {
		register_block_type_from_metadata(
			$this->getDir(),
			apply_filters(
				'checkout_engine/block/registration/args',
				[ 'render_callback' => [ $this, 'preRender' ] ],
			),
		);
	}

	/**
	 * Get the called class directory path
	 *
	 * @return string
	 */
	public function getDir() {
		if ( $this->directory ) {
			return $this->directory;
		}

		$reflector = new \ReflectionClass( $this );
		$fn        = $reflector->getFileName();
		return dirname( $fn );
	}

	/**
	 * Nothing to bootstrap.
	 *
	 * @param \Pimple\Container $container Service container.
	 */
	public function bootstrap( $container ) {
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

		if ( true !== $render ) {
			return $render;
		}

		$attributes = $this->getAttributes( $attributes );

		// render.
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
	 * Allows filtering of attributes before rendering.
	 *
	 * @param array $attributes Block attributes.
	 * @return array $attributes
	 */
	public function getAttributes( $attributes ) {
		return $attributes;
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
		return 'asdf';
	}
}
