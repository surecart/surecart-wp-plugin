<?php

namespace CheckoutEngine\Tests;

use WP_UnitTestCase;
use CheckoutEngine\Models\CheckoutSession;
use CheckoutEngine\Request\RequestService;

class CheckoutSessionTest extends WP_UnitTestCase
{
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
	}

	public function test_can_create_session()
	{
		// mock the requests in the container
		$requests = $this->createMock(RequestService::class);
		\CheckoutEngine::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$data = [
			"customer_first_name" => "Joey",
			"customer_last_name" => "Smithy",
			"customer_email" => "joe@gmail.com",
			"currency" => "usd",
			"metadata" => [
				'wp_test' => 'wp_test_value'
			],
			"line_items" => [
				[
					"price_id" => "85109619-529d-47b3-98c3-ca90d22913e4",
					"quantity" => 1
				]
			]
		];

		$response = [
			"customer_first_name" => "Joey",
			"customer_last_name" => "Smithy",
			"customer_email" => "joe@gmail.com",
			"currency" => "usd"
		];

		$requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('checkout_sessions'),
				$this->equalTo([
					'method' => 'POST',
					'body' => $data
				])
			)
			->willReturn($response);

		$instance = new CheckoutSession($data);
		$created = $instance->create();

		$this->assertEquals($created->toArray(), $response);
	}
}
