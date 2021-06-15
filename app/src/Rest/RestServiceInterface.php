<?php

namespace CheckoutEngine\Rest;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

interface RestServiceInterface extends ServiceProviderInterface {
	/**
	 * Register REST Routes
	 *
	 * @return void
	 */
	public function registerRoutes();
}
