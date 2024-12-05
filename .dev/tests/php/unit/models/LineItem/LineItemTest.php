<?php

namespace SureCart\Tests\Models\LineItem;

use SureCart\Models\LineItem;
use SureCart\Models\Product;
use SureCart\Sync\SyncServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class LineItemTest extends SureCartUnitTestCase
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

	/**
	 * @group line_item
	 * @group media
	 */
	public function test_has_image_from_featured_product_media() {
		$line_item = new LineItem([
			'price' => [
				'product' => [
					'id' => 'test',
					'featured_product_media' => [
						'media' => [
							'url' => 'http://example.com/image.jpg',
							'width' => 800,
							'height' => 600,
						]
					],
				]
			]
		]);

		$this->assertNotEmpty($line_item->image);
		$this->assertSame('attachment-thumbnail size-thumbnail ', $line_item->image->class);
		$this->assertSame('(max-width: 150px) 100vw, 150px', $line_item->image->sizes);

		// serialize and unserialize
		$encoded = wp_json_encode($line_item);
		$decoded = json_decode($encoded, true);

		$this->assertSame('attachment-thumbnail size-thumbnail ', $decoded['image']['class']);
		$this->assertSame('attachment-thumbnail size-thumbnail ', $decoded['image']['class']);
		$this->assertSame('(max-width: 150px) 100vw, 150px', $decoded['image']['sizes']);

		$decoded = json_decode($encoded);

		$this->assertSame('attachment-thumbnail size-thumbnail ', $decoded->image->class);
		$this->assertSame('attachment-thumbnail size-thumbnail ', $decoded->image->class);
		$this->assertSame('(max-width: 150px) 100vw, 150px', $decoded->image->sizes);
	}

	/**
	 * @group line_item
	 * @group media
	 */
	public function test_has_image_from_wp_gallery_media() {
		$this->markTestIncomplete('This test has not been implemented yet.');
		$this->shouldSyncProduct('test2');
		$product = new Product([
			'id' => 'test2',
			'name' => 'test',
			'updated_at' => time(),
			'created_at' => time()
		]);
		$product = $product->sync();
		$post = $product->post;

		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$id = $this->factory()->attachment->create_upload_object( $filename );

		update_post_meta($post->ID, 'gallery', [['id' => $id]]);

		$line_item = new LineItem([
			'price' => [
				'product' => $product->toArray()
			]
		]);

		$this->assertNotEmpty($line_item->image);
		$this->assertSame('attachment-thumbnail size-thumbnail', $line_item->image->class);
		$this->assertStringContainsString('test-image', $line_item->image->src);
	}

	/**
	 * @group line_item
	 * @group media
	 */
	public function test_has_image_from_variant_image() {
		$line_item = new LineItem([
			'price' => [
				'product' => [
					'id' => 'test',
					'featured_product_media' => [
						'media' => [
							'url' => 'http://example.com/image.jpg',
							'width' => 800,
							'height' => 600,
						]
					],
				]
			],
			'variant' => [
				'image' => [
					'url' => 'http://example.com/image2.jpg',
					'width' => 800,
					'height' => 600,
				]
			]
		]);

		$this->assertNotEmpty($line_item->image);
		$this->assertSame('attachment-thumbnail size-thumbnail ', $line_item->image->class);
		$this->assertStringContainsString('http://example.com/image2.jpg', $line_item->image->src);
	}

	/**
	 * @group line_item
	 * @group media
	 */
	public function test_has_image_from_variant_wp_media() {
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$id = $this->factory()->attachment->create_upload_object( $filename );

		$line_item = new LineItem([
			'price' => [
				'product' => [
					'id' => 'test',
					'featured_product_media' => [
						'media' => [
							'url' => 'http://example.com/image.jpg',
							'width' => 800,
							'height' => 600,
						]
					],
				]
			],
			'variant' => [
				'metadata' => (object) [
					'wp_media' => $id
				]
			]
		]);

		$this->assertNotEmpty($line_item->image);
		$this->assertSame('attachment-thumbnail size-thumbnail', $line_item->image->class);
		$this->assertStringContainsString('test-image', $line_item->image->src);
	}
}
