<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\OrderRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class OrderRestServiceProviderTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				OrderRestServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class
			]
		], false);
	}
}
