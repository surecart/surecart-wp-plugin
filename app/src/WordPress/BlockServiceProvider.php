<?php

/**
 * Block Service Provider
 */

namespace CheckoutEngine\WordPress;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Undocumented class
 *
 * @author  Checkout Engine <andre@checkoutengine.com>
 * @since   1.0.0
 * @license GPL
 */
class BlockServiceProvider implements ServiceProviderInterface {

	/**
	 * List of blocks to include
	 *
	 * @var array
	 */
	protected $blocks = [
		\CheckoutEngine\Blocks\CheckoutForm::class,
	];

	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 *
	 * @return void
	 *
	 * phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter
	 */
	public function bootstrap( $container ) {
		$this->registerBlocks();
	}

	/**
	 * Something
	 *
	 * @return  void
	 * @since   1.0.0
	 * @license GPL
	 */
	public function registerBlocks() {
		foreach ( $this->blocks as $block ) {
			( new $block() )->register();
		}
	}
}
