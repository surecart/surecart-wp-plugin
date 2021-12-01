<?php
namespace CheckoutEngine\Tests;

use WP_UnitTestCase;
use CheckoutEngine\Request\RequestService;
use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use \Mockery;

abstract class CheckoutEngineUnitTestCase extends WP_UnitTestCase {
	public $mock_requests;

	public function tearDown()
	{
	  parent::tearDown();
	  \CheckoutEngine::setApplication( null );
	  Mockery::close();
	}

	public function setupMockRequests()
	{
		// mock the requests in the container
		$requests = $this->createMock(RequestService::class);
		\CheckoutEngine::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$this->mock_requests = $requests;
	}
}
