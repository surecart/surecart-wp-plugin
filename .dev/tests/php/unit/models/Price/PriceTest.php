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
				\SureCart\Account\AccountServiceProvider::class
			]
		], false);

		// setup mock requests
		$this->setupMockRequests();
	}

	public function test_can_create_price()
	{
		$request = json_decode(file_get_contents(dirname(__FILE__) . '/price-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/price-created.json'));

		// mock requests
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// then make the request./**
		$requests->shouldReceive('makeRequest')
			->atLeast()
			->once()
			->withSomeOfArgs('prices')
			->andReturn($response);

		// then make the request./**
		$requests->shouldReceive('makeRequest')
			->atLeast()
			->once()
			->withSomeOfArgs('account')
			->andReturn((object) ['products_updated_at' => 12345]);

		$instance = new Price($request['price']);
		$created = $instance->create();

		// has a product
		$this->assertInstanceOf(Product::class, $created->product);

		// response is correct
		$this->assertEquals($created->toArray(), json_decode(json_encode($response), true));
	}
}
