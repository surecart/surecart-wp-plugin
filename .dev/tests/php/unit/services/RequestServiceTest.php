<?php

namespace CheckoutEngine\Tests\Services;

use CheckoutEngine\Request\RequestService;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class RequestServiceTest extends CheckoutEngineUnitTestCase
{
	protected $requests;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				\CheckoutEngine\Request\RequestServiceProvider::class,
			]
		], false);

		// setup mock requests
		$this->setupMockRequests();

		parent::setUp();
	}

	public function test_getToken()
	{
		$service = new RequestService();
		$this->assertSame('test_RiHtAnf4utLC5QJKBRDWJob5', $service->getToken());
		$this->assertSame('test_RiHtAnf4utLC5QJKBRDWJob5', $service->getToken('live'));
		$this->assertSame('test_RiHtAnf4utLC5QJKBRDWJob5', $service->getToken('test'));
	}

	public function test_getUrlRoot()
	{
		$service = new RequestService();
		$this->assertSame('https://presto-pay-staging.herokuapp.com', $service->getUrlRoot('staging'));
		$this->assertSame('https://presto-pay-staging.herokuapp.com', $service->getUrlRoot('live'));
	}

	public function test_gets_base_url()
	{
		$service = new RequestService();
		$this->assertSame('https://presto-pay-staging.herokuapp.com/api/v1/', $service->getBaseUrl());
	}
}
