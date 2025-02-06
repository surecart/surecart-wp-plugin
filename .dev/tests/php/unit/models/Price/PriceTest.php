<?php

namespace SureCart\Tests\Models;

use SureCart\Models\Price;
use SureCart\Models\Product;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

class PriceTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Settings\SettingsServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Account\AccountServiceProvider::class,
				\SureCart\Sync\SyncServiceProvider::class,
			]
		], false);

		// setup mock requests
		$this->setupMockRequests();
	}

	public function test_can_create_price()
	{
		$this->shouldSyncProduct('9f86c425-bed7-45a8-841f-ba5ef5efdfef');

		$request = json_decode(file_get_contents(dirname(__FILE__) . '/price-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/price-created.json'));
		$product_response = json_decode(file_get_contents(dirname(__FILE__) . '/../Product/product-created.json'));

		// mock requests
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// make the prices request.
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('prices')
			->andReturn($response);

		// we also expect a product request to sync.
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('products/9f86c425-bed7-45a8-841f-ba5ef5efdfef')
			->andReturn($product_response);

		$this->markTestIncomplete('This test has not been implemented yet.');
		// create the price.
		$created = Price::create( $request['price'] );

		// has a product
		$this->assertInstanceOf(Product::class, $created->product);
		$this->assertEquals('9f86c425-bed7-45a8-841f-ba5ef5efdfef', $created->product->id);
		$this->assertNotEmpty($created->id);

		// we expect the product to have synced to the post.
		$this->assertNotEmpty($created->product->post);
		$this->assertEquals('9f86c425-bed7-45a8-841f-ba5ef5efdfef', $created->product->post->product->id);
	}

	public function test_can_update_price()
	{
		$this->shouldSyncProduct('9f86c425-bed7-45a8-841f-ba5ef5efdfef');

		$request = json_decode(file_get_contents(dirname(__FILE__) . '/price-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/price-created.json'));
		$product_response = json_decode(file_get_contents(dirname(__FILE__) . '/../Product/product-created.json'));

		// mock requests
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// make the prices request.
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('prices')
			->andReturn($response);

		// we also expect a product request to sync.
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('products/9f86c425-bed7-45a8-841f-ba5ef5efdfef')
			->andReturn($product_response);

		$this->markTestIncomplete('Need to implement update method in Price model');
		// create the price.
		$created = Price::update( $request['price'] );

		// has a product
		$this->assertInstanceOf(Product::class, $created->product);
		$this->assertEquals('9f86c425-bed7-45a8-841f-ba5ef5efdfef', $created->product->id);
		$this->assertNotEmpty($created->id);

		// we expect the product to have synced to the post.
		$this->assertNotEmpty($created->product->post);
		$this->assertEquals('9f86c425-bed7-45a8-841f-ba5ef5efdfef', $created->product->post->product->id);
	}
}
