<?php

namespace CheckoutEngine\Tests\Models\Order;

use CheckoutEngine\Models\Order;
use CheckoutEngine\Models\User;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class OrderTest extends CheckoutEngineUnitTestCase
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

	/**
	 * @group session
	 * @group models
	 */
	public function test_can_create_draft_order()
	{
		$this->mock_requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('orders'),
				$this->equalTo([
					'method' => 'POST',
					'body' => [
						'order' => [
							"currency" => "usd",
							"line_items" => [
								[
									"price_id" => "85109619-529d-47b3-98c3-ca90d22913e4",
									"quantity" => 2
								]
							]
						]
					],
					'query' => []
				])
			)
			->willReturn((object) [
				"currency" => "usd",
				"line_items" => [
					[
						"price_id" => "85109619-529d-47b3-98c3-ca90d22913e4",
						"quantity" => 2
					]
				]
			]);

		$created = (new Order([
			"currency" => "usd",
			"line_items" => [
				[
					"price_id" => "85109619-529d-47b3-98c3-ca90d22913e4",
					"quantity" => 2
				]
			]
		]))->save();

		// we don't care about the order.
		$this->assertEqualsCanonicalizing($created->getAttributes(), [
			"currency" => "usd",
			"line_items" => [
				[
					"price_id" => "85109619-529d-47b3-98c3-ca90d22913e4",
					"quantity" => 2
				]
			]
		]);
	}

	/**
	 * @group session
	 * @group models
	 */
	public function test_finalize_order()
	{
		$request = json_decode(file_get_contents(dirname(__FILE__) . '/session-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/session-finalized.json'), true);

		$this->mock_requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('orders/test_order/finalize/'),
				$this->equalTo([
					'method' => 'PATCH',
					'body' => [
						"order" => [
							"id" => "test_order",
							"customer_first_name" => "Joey",
							"customer_last_name" => "Smithy",
							"customer_email" => "joe@gmail.com",
							"currency" => "usd",
							"metadata" => [],
							"line_items" => [
								[
									"price_id" => "85109619-529d-47b3-98c3-ca90d22913e4",
									"quantity" => 2
								]
							]
						]
					],
					'query' => []
				])
			)
			->willReturn($response);

		$instance = new Order($request['order'], 'custom');
		$prepared = $instance->finalize();

		// make sure attriutes page
		$this->assertEquals($prepared->getAttributes(), $response);
	}
}
