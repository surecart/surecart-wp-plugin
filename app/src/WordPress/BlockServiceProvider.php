<?php

namespace CheckoutEngine\WordPress;

use CheckoutEngine\Blocks\Checkout\CheckoutBlock;
use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Registers block entities, like scripts and styles
 */
class BlockServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		$this->registerBlocks();
	}

	public function registerBlocks() {
		( new CheckoutBlock() )->register();
	}

}
