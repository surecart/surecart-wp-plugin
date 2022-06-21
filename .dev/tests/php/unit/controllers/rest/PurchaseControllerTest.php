<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Controllers\Rest\PurchasesController;
use WP_REST_Request;

class PurchaseControllerTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	public $requests;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Support\Errors\ErrorsServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);

		parent::setUp();
	}

	/**
	 * @group integration
	 */
	public function test_revoke() {
		// mock requests
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// then make the request./**
		$requests->shouldReceive('makeRequest')
			->atLeast()
			->once()
			->withSomeOfArgs('purchases/test/revoke/')
			->andReturn(json_decode(file_get_contents(dirname(__FILE__) . '/fixtures/revoked-purchase.json')));

		// finalize the order.
		$request = new WP_REST_Request('POST', '/surecart/v1/purchases/test/revoke');
		$request->set_param('id', 'test');

		// mock controller.
		$controller = \Mockery::mock(PurchasesController::class)->makePartial();
		$controller->revoke($request);

		// assert purchase revoked action.
		$this->assertSame(1, did_action('surecart/purchase_revoked'), 'Purchase revoke action was not triggered.');
	}

	/**
	 * @group integration
	 */
	public function test_invoke() {
		// mock requests
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// then make the request./**
		$requests->shouldReceive('makeRequest')
			->atLeast()
			->once()
			->withSomeOfArgs('purchases/test/invoke/')
			->andReturn(json_decode(file_get_contents(dirname(__FILE__) . '/fixtures/active-purchase.json')));

		// finalize the order.
		$request = new WP_REST_Request('POST', '/surecart/v1/purchases/test/invoke');
		$request->set_param('id', 'test');

		// mock controller.
		$controller = \Mockery::mock(PurchasesController::class)->makePartial();
		$controller->invoke($request);

		// assert purchase revoked action.
		$this->assertSame(1, did_action('surecart/purchase_invoked'), 'Purchase invoke action was not triggered.');
	}
}
