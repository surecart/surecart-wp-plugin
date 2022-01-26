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

		$this->assertEquals($prepared->getAttributes(), $response);
		$this->assertNotFalse(get_user_by('email', $response['customer']['email']));
	}

	public function test_maybeAssociateUser() {
		// empty order won't work.
		$instance = new Order([]);
		$this->assertFalse($instance->maybeAssociateUser());

		// needs id
		$instance['id'] = 'test_order';
		$this->assertFalse($instance->maybeAssociateUser());

		// needs customer
		$instance['customer'] = [
			'id' => 'test_customer',
			'email' => 'test@test.com',
		];
		$associated = $instance->maybeAssociateUser();
		$this->assertNotFalse($associated);
		$this->assertInstanceOf(User::class, $associated);
		$this->assertSame($associated->user_email, 'test@test.com');
		$this->assertNotFalse(get_user_by('email', $associated->user_email));
	}

	// /*
	//  * @group failing
	//  */
	// public function test_creates_user_on_finalize()
	// {
	// 	// mock the requests in the container
	// 	$requests =  \Mockery::mock(RequestService::class);
	// 	\CheckoutEngine::alias('request', function () use ($requests) {
	// 		return call_user_func_array([$requests, 'makeRequest'], func_get_args());
	// 	});


	// 	$requests->shouldReceive('makeRequest')
	// 		->once()
	// 		->withSomeOfArgs('orders/test_order/finalize/')
	// 		->andReturn((object) [
	// 			'customer' => [
	// 				'id' => 'test_user',
	// 				"email" => "test@test.com"
	// 			]
	// 		]);

	// 	$order = (new Order( ["id" => "test_order" ] ))
	// 			->setProcessor('stripe')
	// 			->finalize();

	// 	$this->assertNotWPError($order);
	// 	$this->assertNotFalse(get_user_by('email', 'test@test.com'));
	// }

	public function test_can_get_prices()
	{
		$order = new Order((object) [
			'id' => 'test',
			'line_items' => (object) [
				'data' => [
					[
						'id' => 'test_line_item',
						'quantity' => 1,
						'price' => 'asdf'
					]
				]
			]
		]);

		$this->assertNotEmpty($order->prices);
		$this->assertSame(array_column($order->prices, 'id'), ['asdf']);
		$this->assertSame($order->price_ids, ['asdf']);
	}
}
