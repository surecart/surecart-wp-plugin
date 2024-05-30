<?php

namespace SureCart\Tests\Models\Product;

use SureCart\Models\Product;
use SureCart\Models\Price;
use SureCart\Sync\SyncServiceProvider;
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
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Settings\SettingsServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Account\AccountServiceProvider::class,
				SyncServiceProvider::class,
			]
		], false);

		parent::setUp();
	}

	public function test_can_create_price()
	{
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
	public function test_has_featured_image_from_featured_product_media() {
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
		$attributes = $product->featured_image->attributes();
		$this->assertSame('https://surecart.com/cdn-cgi/image/fit=scale-down,format=auto,width=800/http://example.com/image.jpg', $attributes['src']);
		$this->assertSame('attachment-full size-full', $attributes['class']);
		$this->assertSame('(max-width: 800px) 100vw, 800px', $attributes['sizes']);
		$this->assertSame(800, $attributes['width']);
		$this->assertSame(600, $attributes['height']);
		$this->assertSame('lazy', $attributes['loading']);
		$this->assertSame('async', $attributes['decoding']);
		$this->assertStringContainsString('http://example.com/image.jpg', $attributes['srcset']);
	}

	/**
	 * @group media
	 * @group product
	 */
	public function test_has_featured_image_from_product_media_url() {
		$product = new Product([
			'id' => 'test',
			'featured_product_media' => [
				'url' => 'http://example.com/image.jpg',
				'media' => null
			],
		]);
		// this should work for both.
		$attributes = $product->featured_image->attributes();
		$this->assertSame('http://example.com/image.jpg', $attributes['src']);
	}

	/**
	 * @group media
	 * @group product
	 */
	public function test_has_featured_image_from_attachment() {
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

		$this->assertCount(2, $product->gallery);

		$attributes = $product->featured_image->attributes();

		$this->assertStringContainsString('test-image', $attributes['src']);
		$this->assertSame('attachment-full size-full', $attributes['class']);
		$this->assertSame('(max-width: 2560px) 100vw, 2560px', $attributes['sizes']);
		$this->assertSame(2560, $attributes['width']);
		$this->assertSame(1920, $attributes['height']);
		$this->assertSame('lazy', $attributes['loading']);
		$this->assertSame('async', $attributes['decoding']);
		$this->assertStringContainsString('test-image-large',$attributes['srcset']);
	}
}
