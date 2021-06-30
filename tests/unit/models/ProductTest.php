<?php

namespace CheckoutEngine\Tests\Models;

use CheckoutEngine\Models\Product;
use CheckoutEngine\Models\Price;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class ProductTest extends CheckoutEngineUnitTestCase
{
	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				\CheckoutEngine\Request\RequestServiceProvider::class,
			]
		], false);

		// setup mock requests
		$this->setupMockRequests();
	}

	/**
	 * @group failing
	 *
	 * @return void
	 */
	public function test_can_create_price()
	{
		$data = json_decode('{
			"product": {
			  "name": "Other sneakers.",
			  "description": "A pair of fancy sneakers.",
			  "active": true
			}
		  }', true);

		$response = json_decode('{
			"id": "9f86c425-bed7-45a8-841f-ba5ef5efdfef",
			"object": "product",
			"name": "Other sneakers.",
			"description": "A pair of fancy sneakers.",
			"active": true,
			"created_at": 1624910585,
			"updated_at": 1624910585,
			"prices": [
				{
				  "id": "00e5bbf1-6a4a-4e94-9e2b-c64b3f0b3645",
				  "object": "price",
				  "name": "Premium",
				  "active": true,
				  "amount": 9900,
				  "currency": "usd",
				  "recurring": true,
				  "recurring_interval": "month",
				  "recurring_interval_count": 1,
				  "product_id": "00e5bbf1-6a4a-4e94-9e2b-c64b3f0b3645",
				  "createdAt": 1616008115,
				  "updatedAt": 1616008115
				}
			  ]
		  }', true);

		$this->mock_requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('products'),
				$this->equalTo([
					'method' => 'POST',
					'body' => $data
				])
			)
			->willReturn($response);

		$instance = new Product($data['product']);
		$created = $instance->create();

		// has a product
		foreach($created->prices as $price) {
			$this->assertInstanceOf(Price::class, $price);
		}

		// response is correct
		$this->assertEquals($created->toArray(), $response);
	}

}
