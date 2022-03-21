<?php
namespace SureCart\Tests;

use WP_UnitTestCase;
use SureCart\Request\RequestService;
abstract class SureCartUnitTestCase extends WP_UnitTestCase {
	public $mock_requests;

	public function tearDown()
	{
	  parent::tearDown();
	  \SureCart::setApplication( null );
	}

	public function setupMockRequests()
	{
		// mock the requests in the container
		$requests = $this->createMock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$this->mock_requests = $requests;
	}
}
