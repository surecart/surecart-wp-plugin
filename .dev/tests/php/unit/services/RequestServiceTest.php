<?php

namespace SureCart\Tests\Services;

use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

class RequestServiceTest extends SureCartUnitTestCase
{
	protected $requests;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
			]
		], false);

		// setup mock requests
		$this->setupMockRequests();

		parent::setUp();
	}

	public function test_gets_base_url()
	{
		$service = new RequestService();
		$this->assertSame('https://app.surecart.com/api/v1/', $service->getBaseUrl());
	}
}
