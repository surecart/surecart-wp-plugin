<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Models\Order;
use SureCart\Models\User;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Controllers\Rest\SubscriptionsController;
use WP_REST_Request;

class SubscriptionControllerTest extends SureCartUnitTestCase
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
	public function test_cancel() {
		// mock requests
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// then make the request./**
		$requests->shouldReceive('makeRequest')
			->atLeast()
			->once()
			->withSomeOfArgs('subscriptions/test/cancel/')
			->andReturn(json_decode(file_get_contents(dirname(__FILE__) . '/fixtures/canceled-subscription-with-purchase.json')));

		// finalize the order.
		$request = new WP_REST_Request('POST', '/surecart/v1/subscriptions/test/cancel');
		$request->set_param('id', 'test');

		// mock controller.
		$controller = \Mockery::mock(SubscriptionsController::class)->makePartial();
		$controller->cancel($request);

		// assert purchase revoked action.
		$this->assertNotFalse(did_action('surecart/purchase_revoked'));
	}

}
