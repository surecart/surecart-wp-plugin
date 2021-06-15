<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Rest\RestServiceInterface;
use CheckoutEngine\Controllers\Rest\PriceController;

/**
 * Service provider for Price Rest Requests
 */
class PriceRestServiceProvider extends RestServiceProvider implements RestServiceInterface {

	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'price';

	/**
	 * Register REST Routes
	 *
	 * @return void
	 */
	public function registerRoutes() {
		register_rest_route(
			"$this->name/v$this->version",
			"$this->endpoint",
			[
				'methods'  => 'GET',
				'callback' => \CheckoutEngine::closure()->method( PriceController::class, 'index' ),
			]
		);
	}
}
