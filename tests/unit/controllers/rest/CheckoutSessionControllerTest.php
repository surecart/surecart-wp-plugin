<?php

namespace CheckoutEngine\Tests\Controllers\Rest;

use CheckoutEngine\Controllers\Rest\CheckoutSessionController;
use CheckoutEngine\Models\Form;
use CheckoutEngine\Models\CheckoutSession;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;
use WP_REST_Request;

class CheckoutSessionControllerTest extends CheckoutEngineUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

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

		parent::setUp();
	}

	public function test_middleware()
	{
		$request = new WP_REST_Request('POST', '/checkout-engine/v1/checkout-session', [
			'form_id' => 1,
		]);
		$controller = \Mockery::mock(CheckoutSessionController::class);
		$controller->shouldAllowMockingProtectedMethods()->shouldReceive('middleware')->andReturn('live');
		$controller->shouldReceive('create')->andReturn([]);
		$controller->create($request);
	}

	// public function test_appliesFormMiddleware()
	// {
	// 	// mock form class
	// 	$this->createMock(Form::class);


	// 	$foo = $this->getMockBuilder(CheckoutSessionController::class)
	// 		->setMethods(['middleware'])
	// 		->getMock();

	// 	$foo->expects($this->once())
    //         ->method('middleware');

	// 	$foo->expects($this->once())
    //         ->method('remoteRequest')
	// 		->with(
	// 			$this->equalTo('https://presto-pay-staging.herokuapp.com/api/v1/test-endpoint'),
	// 			$this->identicalTo([
	// 				'timeout' => 20,
	// 				'sslverify' => true,
	// 				'headers' => [
	// 					'Content-Type' => 'application/json',
	// 					'Authorization' => 'Bearer test_token',
	// 				]
	// 			])
	// 		)
	// 		->willReturn(['body' => '{test: "passed"}', 'response' => ['code' => 200]]);

	// 	$foo->makeRequest('test-endpoint', [], 'test');
	// }
}
