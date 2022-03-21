<?php

namespace SureCart\Tests\Models;

use SureCart\Models\Price;
use SureCart\Models\Product;
use SureCart\Tests\SureCartUnitTestCase;

class PriceTest extends SureCartUnitTestCase
{
	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
			]
		], false);

		// setup mock requests
		$this->setupMockRequests();
	}

	public function test_can_create_price()
	{
		$request = json_decode(file_get_contents(dirname(__FILE__) . '/price-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/price-created.json'));

		$this->mock_requests->expects($this->once())
			->method('makeRequest')
			->with(
				$this->equalTo('prices'),
				$this->equalTo([
					'method' => 'POST',
					'body' => $request,
					'query' => []
				])
			)
			->willReturn($response);

		$instance = new Price($request['price']);
		$created = $instance->create();

		// has a product
		$this->assertInstanceOf(Product::class, $created->product);

		// response is correct
		$this->assertEquals($created->toArray(), json_decode(json_encode($response), true));
	}
}
