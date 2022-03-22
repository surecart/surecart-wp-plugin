<?php

namespace SureCart\Tests\Models\Product;

use SureCart\Models\Purchase;
use SureCart\Tests\SureCartUnitTestCase;

class PurchaseTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
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
	}

	public function test_revoke()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('purchases/testid/revoke/')
			->andReturn((object) [
				'id' => 'testid',
				'object' => 'purchase',
				'customer' => 'testcustomerid',
				'revoked' => true
			]);

		$purchase = Purchase::revoke('testid');
		$this->assertTrue($purchase->revoked);
	}

	public function test_invoke()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('purchases/testid/invoke/')
			->andReturn((object) [
				'id' => 'testid',
				'object' => 'purchase',
				'customer' => 'testcustomerid',
				'revoked' => false
			]);

		$purchase = Purchase::invoke('testid');
		$this->assertFalse($purchase->revoked);
	}

	public function test_previousProductIdAttribute()
	{
		$attributes = [
			"id" => "10bbede6-af0f-465e-82db-57a07713374a",
			"object" => "purchase",
			"quantity" => 1,
		];

		$purchase = new Purchase($attributes);
		$this->assertFalse($purchase->previous_product_id);
		$this->assertFalse($purchase->previous_quantity);
		$this->assertFalse($purchase->hasProductChanged);

		$attributes = [
			"id" => "10bbede6-af0f-465e-82db-57a07713374a",
			"object" => "purchase",
			"quantity" => 1,
			"previous_attributes" => [
				"product" => "old_product",
				"quantity" => 2,
			],
		];

		$purchase = new Purchase($attributes);

		$this->assertTrue($purchase->hasProductChanged);
		$this->assertSame($purchase->previous_attributes['product'], 'old_product');
		$this->assertSame($purchase->previous_product_id, 'old_product');
		$this->assertSame($purchase->previous_quantity, 2);


		$attributes = [
			"id" => "10bbede6-af0f-465e-82db-57a07713374a",
			"object" => "purchase",
			"quantity" => 1,
			"previous_attributes" => [
				"product" => [
					'id' => 'old_product',
				],
				"quantity" => 2,
			],
		];

		$purchase = new Purchase($attributes);

		$this->assertTrue($purchase->hasProductChanged);
		$this->assertSame($purchase->previous_product_id, 'old_product');
		$this->assertSame($purchase->previous_quantity, 2);
	}
}
