<?php

namespace CheckoutEngine\Rest;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

interface RestServiceInterface extends ServiceProviderInterface {
	/**
	 * Register REST Routes
	 *
	 * @return void
	 */
	public function registerModelRoutes();
}
