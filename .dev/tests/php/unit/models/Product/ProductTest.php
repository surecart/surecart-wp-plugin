<?php

namespace SureCart\Tests\Models\Product;

use SureCart\Background\QueueService;
use SureCart\Models\Product;
use SureCart\Models\Price;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

class ProductTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCartAppCore\AppCore\AppCoreServiceProvider::class,
				\SureCartAppCore\Config\ConfigServiceProvider::class,
				\SureCartAppCore\Assets\AssetsServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Settings\SettingsServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Account\AccountServiceProvider::class,
				\SureCart\Sync\SyncServiceProvider::class,
				\SureCart\WordPress\Posts\PostServiceProvider::class,
				\SureCart\WordPress\PostTypes\PostTypeServiceProvider::class,
				\SureCart\WordPress\Pages\PageServiceProvider::class,
			]
		], false);

		parent::setUp();
	}

	public function test_can_create()
	{
		$this->shouldSyncProduct('9f86c425-bed7-45a8-841f-ba5ef5efdfef');

		$request = json_decode(file_get_contents(dirname(__FILE__) . '/product-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/product-created.json'));

		// mock requests
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// then make the request.
		$requests->shouldReceive('makeRequest')->andReturn($response);

		$queue_service =  \Mockery::mock(QueueService::class)->makePartial();
		\SureCart::alias('queue', function () use ($queue_service) {
			return $queue_service;
		});

		// it should queue the an async request since the post has not yet been created.
		$queue_service
			->shouldReceive('async')
			->andReturn(true);

		$instance = new Product($request['product']);
		$created = $instance->create();

		$this->assertNotEmpty($created->post);
	}

	public function test_can_update()
	{
		$this->shouldSyncProduct('9f86c425-bed7-45a8-841f-ba5ef5efdfef');

		$request = json_decode(file_get_contents(dirname(__FILE__) . '/product-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/product-created.json'));

		// mock requests
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// then make the request.
		$requests->shouldReceive('makeRequest')->andReturn($response);

		$queue_service =  \Mockery::mock(QueueService::class)->makePartial();
		\SureCart::alias('queue', function () use ($queue_service) {
			return $queue_service;
		});

		// it should queue the an async request since the post has not yet been created.
		$queue_service
			->shouldReceive('async')
			->andReturn(true);

		$created = Product::update($request['product']);

		$this->assertNotEmpty($created->post);
	}

	public function test_can_delete() {
		$this->shouldSyncProduct('9f86c425-bed7-45a8-841f-ba5ef5efdfef');

		$request = json_decode(file_get_contents(dirname(__FILE__) . '/product-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/product-created.json'));

		// mock requests
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// then make the request.
		$requests->shouldReceive('makeRequest')
			->withSomeOfArgs('products')
			->andReturn($response);

		$requests->shouldReceive('makeRequest')
			->withSomeOfArgs('products/' . $response->id)
			->andReturn($response);

		$queue_service =  \Mockery::mock(QueueService::class)->makePartial();
		\SureCart::alias('queue', function () use ($queue_service) {
			return $queue_service;
		});

		// it should queue the an async request since the post has not yet been created.
		$queue_service
			->shouldReceive('async')
			->andReturn(true);

		$created = Product::update($request['product']);

		$id = $created->post->ID;
		$this->assertNotEmpty(get_post($id));

		Product::delete($created->id);

		$this->assertEmpty(get_post($id));
	}

	public function test_can_create_price()
	{
		$this->shouldSyncProduct('9f86c425-bed7-45a8-841f-ba5ef5efdfef');

		$request = json_decode(file_get_contents(dirname(__FILE__) . '/product-create.json'), true);
		$response = json_decode(file_get_contents(dirname(__FILE__) . '/product-created.json'));

		// mock requests
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// then make the request.
		$requests->shouldReceive('makeRequest')
			->andReturn($response);

		$queue_service =  \Mockery::mock(QueueService::class)->makePartial();
		\SureCart::alias('queue', function () use ($queue_service) {
			return $queue_service;
		});

		// it should queue the an async request since the post has not yet been created.
		$queue_service
			->shouldReceive('async')
			->andReturn(true);

		$instance = new Product($request['product']);
		$created = $instance->create();

		// has prices.
		foreach($created->prices->data as $price) {
			$this->assertInstanceOf(Price::class, $price);
		}
	}

	/**
	 * @group media
	 * @group product
	 */
	public function test_has_images_from_featured_product_media() {
		$this->shouldSyncProduct('test');

		$product = new Product([
			'id' => 'test',
			'featured_product_media' => [
				'media' => [
					'url' => 'http://example.com/image.jpg',
					'width' => 800,
					'height' => 600,
				]
			],
		]);
		// this should work for both.
		$featured = $product->featured_image->attributes();
		$this->assertSame('https://surecart.com/cdn-cgi/image/fit=scale-down,format=auto,width=800/http://example.com/image.jpg', $featured->src);
		$this->assertSame('attachment-full size-full ', $featured->class);
		$this->assertSame('(max-width: 800px) 100vw, 800px', $featured->sizes);
		$this->assertSame(800, $featured->width);
		$this->assertSame(600, $featured->height);
		$this->assertSame('lazy', $featured->loading);
		$this->assertSame('async', $featured->decoding);
		$this->assertStringContainsString('http://example.com/image.jpg', $featured->srcset);

		$line_item_image = $product->line_item_image;
		$this->assertSame('https://surecart.com/cdn-cgi/image/fit=scale-down,format=auto,width=150/http://example.com/image.jpg', $line_item_image->src);
		$this->assertSame('attachment-thumbnail size-thumbnail ', $line_item_image->class);
		$this->assertSame('(max-width: 150px) 100vw, 150px', $line_item_image->sizes);
		$this->assertSame(150, $line_item_image->width);
		$this->assertSame(113, $line_item_image->height);
		$this->assertSame('lazy', $line_item_image->loading);
		$this->assertSame('async', $line_item_image->decoding);
		$this->assertStringContainsString('http://example.com/image.jpg', $line_item_image->srcset);
	}

	/**
	 * @group media
	 * @group product
	 */
	public function test_has_images_from_product_media_url() {
		$this->shouldSyncProduct('test');

		$product = new Product([
			'id' => 'test',
			'featured_product_media' => [
				'url' => 'http://example.com/image.jpg',
				'media' => null
			],
		]);
		// this should work for both.
		$attributes = $product->featured_image->attributes();
		$this->assertSame('http://example.com/image.jpg', $attributes->src);

		$line_item_image = $product->line_item_image;
		$this->assertSame('http://example.com/image.jpg', $line_item_image->src);
	}

	// /**
	//  * @group media
	//  * @group product
	//  * @group producttesting
	//  */
	// public function test_has_featured_image_from_attachment() {
	// 	$this->shouldSyncProduct('test');

	// 	$filename = DIR_TESTDATA . '/images/test-image-large.jpg';
	// 	$id = $this->factory()->attachment->create_upload_object( $filename );

	// 	$filename = DIR_TESTDATA . '/images/test-image.jpg';
	// 	$id_2 = $this->factory()->attachment->create_upload_object( $filename );

	// 	$queue_service =  \Mockery::mock(QueueService::class)->makePartial();
	// 	\SureCart::alias('queue', function () use ($queue_service) {
	// 		return $queue_service;
	// 	});

	// 	// it should queue the an async request since the post has not yet been created.
	// 	$queue_service
	// 		->shouldReceive('async')
	// 		->andReturn(true);

	// 	$product = (new Product([
	// 		'id' => 'test',
	// 		'name' => 'test',
	// 		'updated_at' => time(),
	// 		'created_at' => time(),
	// 		'gallery_ids' => [$id, $id_2],
	// 	]))->sync();
	// 	$post = $product->post;

	// 	// $this->assertSame('', $post);
	// 	$this->assertSame(1, $product);
	// 	// $this->assertCount(2, $post->gallery);
	// 	$this->assertNotEmpty($product->featured_image);

	// 	$attributes = $product->featured_image->attributes();

	// 	$this->assertStringContainsString('test-image', $attributes->src);
	// 	$this->assertSame('attachment-full size-full', $attributes->class);
	// 	$this->assertSame('(max-width: 2560px) 100vw, 2560px', $attributes->sizes);
	// 	$this->assertSame(2560, $attributes->width);
	// 	$this->assertSame(1920, $attributes->height);
	// 	$this->assertSame('lazy', $attributes->loading);
	// 	$this->assertSame('async', $attributes->decoding);
	// 	$this->assertStringContainsString('test-image-large',$attributes->srcset);

	// 	$attributes = $product->featured_image->attributes('large');
	// 	$this->assertStringContainsString('test-image', $attributes->src);
	// 	$this->assertSame('attachment-large size-large', $attributes->class);
	// 	$this->assertSame('(max-width: 1024px) 100vw, 1024px', $attributes->sizes);
	// 	$this->assertSame(1024, $attributes->width);
	// 	$this->assertSame(768, $attributes->height);
	// 	$this->assertSame('lazy', $attributes->loading);
	// 	$this->assertSame('async', $attributes->decoding);
	// 	$this->assertStringContainsString('test-image-large',$attributes->srcset);

	// 	$attributes = $product->featured_image->attributes('thumbnail');
	// 	$this->assertStringContainsString('test-image', $attributes->src);
	// 	$this->assertSame('attachment-thumbnail size-thumbnail', $attributes->class);
	// 	$this->assertSame(150, $attributes->width);
	// 	$this->assertSame(150, $attributes->height);
	// 	$this->assertSame('lazy', $attributes->loading);
	// 	$this->assertSame('async', $attributes->decoding);

	// 	$line_item_image = $product->line_item_image;
	// 	$this->assertStringContainsString('test-image', $attributes->src);
	// 	$this->assertSame('attachment-thumbnail size-thumbnail', $line_item_image->class);
	// 	$this->assertSame(150, $line_item_image->width);
	// 	$this->assertSame(150, $line_item_image->height);
	// 	$this->assertSame('lazy', $line_item_image->loading);
	// 	$this->assertSame('async', $line_item_image->decoding);
	// }

	/**
	 * @group media
	 * @group product
	 */
	public function test_has_featured_image_from_attachment() {
		$this->shouldSyncProduct('test');

		$queue_service = \Mockery::mock(QueueService::class)->makePartial();
		\SureCart::alias('queue', function () use ($queue_service) {
			return $queue_service;
		});
		$queue_service->shouldReceive('async')->andReturn(true);

		$product = new Product([
			'id' => 'test',
			'name' => 'test',
			'updated_at' => time(),
			'created_at' => time()
		]);
		$product = $product->sync();
		$post = $product->post;

		$filename = DIR_TESTDATA . '/images/test-image-large.jpg';
		$id = $this->factory()->attachment->create_upload_object( $filename );

		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$id_2 = $this->factory()->attachment->create_upload_object( $filename );

		update_post_meta($post->ID, 'gallery', [['id' => $id], ['id' => $id_2]]);

		$this->markTestIncomplete('This test has not been implemented yet.');
		$this->assertSame(2, $product);
		$this->assertCount(2, $product->gallery);

		$attributes = $product->featured_image->attributes();

		$this->assertStringContainsString('test-image', $attributes->src);
		$this->assertSame('attachment-full size-full', $attributes->class);
		$this->assertSame('(max-width: 2560px) 100vw, 2560px', $attributes->sizes);
		$this->assertSame(2560, $attributes->width);
		$this->assertSame(1920, $attributes->height);
		$this->assertSame('lazy', $attributes->loading);
		$this->assertSame('async', $attributes->decoding);
		$this->assertStringContainsString('test-image-large',$attributes->srcset);

		$attributes = $product->featured_image->attributes('large');
		$this->assertStringContainsString('test-image', $attributes->src);
		$this->assertSame('attachment-large size-large', $attributes->class);
		$this->assertSame('(max-width: 1024px) 100vw, 1024px', $attributes->sizes);
		$this->assertSame(1024, $attributes->width);
		$this->assertSame(768, $attributes->height);
		$this->assertSame('lazy', $attributes->loading);
		$this->assertSame('async', $attributes->decoding);
		$this->assertStringContainsString('test-image-large',$attributes->srcset);

		$attributes = $product->featured_image->attributes('thumbnail');
		$this->assertStringContainsString('test-image', $attributes->src);
		$this->assertSame('attachment-thumbnail size-thumbnail', $attributes->class);
		$this->assertSame(150, $attributes->width);
		$this->assertSame(150, $attributes->height);
		$this->assertSame('lazy', $attributes->loading);
		$this->assertSame('async', $attributes->decoding);

		$line_item_image = $product->line_item_image;
		$this->assertStringContainsString('test-image', $attributes->src);
		$this->assertSame('attachment-thumbnail size-thumbnail', $line_item_image->class);
		$this->assertSame(150, $line_item_image->width);
		$this->assertSame(150, $line_item_image->height);
		$this->assertSame('lazy', $line_item_image->loading);
		$this->assertSame('async', $line_item_image->decoding);
	}

	/**
	 * Test has_variants attribute
	 */
	public function test_has_variants_attribute()
	{
		$this->shouldSyncProduct('test-variants');

		// Test with no variant options
		$product = new Product([
			'id' => 'test-no-variants',
			'variant_options' => (object) [
				'data' => []
			]
		]);
		$this->assertFalse($product->has_variants);

		// Test with variant options
		$product = new Product([
			'id' => 'test-with-variants',
			'variants' => (object) [
				'data' => [
					['id' => 'opt1'],
					['id' => 'opt2']
				]
			]
		]);
		$this->assertTrue($product->has_variants, 'Product has variants');

		// Test with null variant_options
		$product = new Product([
			'id' => 'test-null-variants'
		]);
		$this->assertFalse($product->has_variants);
	}

	/**
	 * Test active_ad_hoc_prices attribute
	 */
	public function test_active_ad_hoc_prices_attribute()
	{
		$this->shouldSyncProduct('test-ad-hoc');

		$product = new Product([
			'id' => 'test-ad-hoc-prices',
			'prices' => (object) [
				'data' => [
					['id' => 'price1', 'archived' => false, 'ad_hoc' => true, 'amount' => 1000], 
					['id' => 'price2', 'archived' => false, 'ad_hoc' => false, 'amount' => 2000], 
					['id' => 'price3', 'archived' => true, 'ad_hoc' => true, 'amount' => 3000], 
					['id' => 'price4', 'archived' => false, 'ad_hoc' => true, 'amount' => 4000]
				]
			]
		]);

		$activeAdHocPrices = $product->active_ad_hoc_prices;

		// Should only include active (non-archived) ad hoc prices
		$this->assertCount(2, $activeAdHocPrices);
		
		// Convert to array values to ensure proper indexing
		$activeAdHocPricesArray = array_values($activeAdHocPrices);
		$this->assertSame('price1', $activeAdHocPricesArray[0]->id);
		$this->assertSame('price4', $activeAdHocPricesArray[1]->id);

		// Test with no prices
		$product = new Product([
			'id' => 'test-no-prices'
		]);
		$this->assertEmpty($product->active_ad_hoc_prices);

		// Test with no ad hoc prices
		$product = new Product([
			'id' => 'test-no-ad-hoc',
			'prices' => (object) [
				'data' => [
					['id' => 'price5', 'archived' => false, 'ad_hoc' => false, 'amount' => 5000, 'position' => 0]
				]
			]
		]);
		$this->assertEmpty($product->active_ad_hoc_prices);
	}

	/**
	 * Test has_options attribute
	 */
	public function test_has_options_attribute()
	{
		$this->shouldSyncProduct('test-options');

		// Test with variants
		$product = new Product([
			'id' => 'test-options-variants',
			'variants' => (object) [
				'data' => [['id' => 'opt1']]
			],
			'prices' => (object) [
				'data' => [['id' => 'price1', 'archived' => false, 'ad_hoc' => false, 'position' => 0]]
			]
		]);
		$this->assertTrue($product->has_options);

		// Test with multiple prices
		$product = new Product([
			'id' => 'test-options-multiple-prices',
			'prices' => (object) [
				'data' => [
					['id' => 'price1', 'archived' => false, 'position' => 0],
					['id' => 'price2', 'archived' => false, 'position' => 1]
				]
			]
		]);
		$this->assertTrue($product->has_options);

		// Test with ad hoc prices
		$product = new Product([
			'id' => 'test-options-ad-hoc',
			'prices' => (object) [
				'data' => [
					['id' => 'price1', 'archived' => false, 'ad_hoc' => true, 'position' => 0]
				]
			]
		]);
		$this->assertTrue($product->has_options);

		// Test with no options (single non-ad-hoc price, no variants)
		$product = new Product([
			'id' => 'test-no-options',
			'prices' => (object) [
				'data' => [
					['id' => 'price1', 'archived' => false, 'ad_hoc' => false, 'position' => 0]
				]
			]
		]);
		$this->assertFalse($product->has_options);

		// Test with archived prices only (should have no options)
		$product = new Product([
			'id' => 'test-archived-prices',
			'prices' => (object) [
				'data' => [
					['id' => 'price1', 'archived' => true, 'position' => 0],
					['id' => 'price2', 'archived' => true, 'position' => 1]
				]
			]
		]);
		$this->assertFalse($product->has_options);
	}
}
