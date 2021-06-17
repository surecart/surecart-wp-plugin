<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Rest\RestServiceInterface;

/**
 * Abstract Rest Service Provider interface
 */
abstract class RestServiceProvider extends \WP_REST_Controller implements RestServiceInterface {
	/**
	 * Plugin namespace.
	 *
	 * @var string
	 */
	protected $name = 'checkout-engine';

	/**
	 * API Version
	 *
	 * @var string
	 */
	protected $version = '1';

	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = '';

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * Bootstrap routes
	 *
	 * @param  \Pimple\Container $container Service Container.
	 *
	 * @return void
	 */
	public function bootstrap( $container ) {
		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );
	}

	/**
	 * Register REST Routes
	 *
	 * @return void
	 */
	public function registerRoutes() {
	}
}
