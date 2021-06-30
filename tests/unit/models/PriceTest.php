<?php

namespace CheckoutEngine\Tests\Models;

use CheckoutEngine\Models\Price;
use CheckoutEngine\Models\Product;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class PriceTest extends CheckoutEngineUnitTestCase
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

	public function test_can_create_price()
	{
		$data = json_decode('{
			"price": {
				"name": "Simple Price",
				"amount": 2900,
				"currency": "usd",
				"recurring": false,
				"recurring_interval": null,
				"recurring_interval_count": null,
				"active": true,
				"product_id": "5ff6e35b-8297-43f0-b548-2efdf16d0206"
			}
    	}', true);

		$response = json_decode('{
			"id": "6b6f10b8-1054-455b-83e5-86be0e6fa74e",
			"object": "price",
			"name": "Simple Price",
			"active": true,
			"amount": 2900,
			"currency": "usd",
			"recurring": false,
			"recurring_interval": null,
			"recurring_interval_count": null,
			"product_id": "5ff6e35b-8297-43f0-b548-2efdf16d0206",
			"created_at": 1624717374,
			"updated_at": 1624717374,
			"product": {
			  "id": "5ff6e35b-8297-43f0-b548-2efdf16d0206",
			  "object": "product",
			  "name": "Sneakers",
			  "description": "A pair of everyday sneakers.",
			  "active": true,
			  "created_at": 1624716432,
			  "updated_at": 1624717374
			}
		  }', true);

		$this->mock_requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('prices'),
				$this->equalTo([
					'method' => 'POST',
					'body' => $data
				])
			)
			->willReturn($response);

		$instance = new Price($data['price']);
		$created = $instance->create();

		// has a product
		$this->assertInstanceOf(Product::class, $created->product);

		// response is correct
		$this->assertEquals($created->toArray(), $response);
	}

}
