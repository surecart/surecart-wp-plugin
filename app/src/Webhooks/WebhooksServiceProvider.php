<?php

namespace CheckoutEngine\Webhooks;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * WordPress Users service.
 */
class WebhooksServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		( new WebhooksService() )->maybeCreateWebooks();
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
	}
}
