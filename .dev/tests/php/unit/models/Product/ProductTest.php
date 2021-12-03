<?php

namespace CheckoutEngine\Tests\Models\Product;

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
		$request = json_decode(file_get_contents(dirname(__FILE__) . '/product-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/product-created.json'));

		$this->mock_requests->expects($this->once())
		->method('makeRequest')
		->with(
			$this->equalTo('products'),
			$this->equalTo([
				'method' => 'POST',
				'body' => $request,
				'query' => []
			])
		)
		->willReturn($response);

		$instance = new Product($request['product']);
		$created = $instance->create();

		// has a product
		foreach($created->prices->data as $price) {
			$this->assertInstanceOf(Price::class, $price);
		}
		// response is correct
		$this->assertEquals($created->toArray(), json_decode(json_encode($response), true));
	}
}
