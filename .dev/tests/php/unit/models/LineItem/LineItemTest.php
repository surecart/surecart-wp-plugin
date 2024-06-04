<?php

namespace SureCart\Tests\Models\LineItem;

use SureCart\Models\LineItem;
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
		]);
		$this->assertSame('attachment-thumbnail size-thumbnail', $line_item->image->class);
		$this->assertSame('attachment-thumbnail size-thumbnail', $line_item->image->class);
		$this->assertSame('(max-width: 150px) 100vw, 150px', $line_item->image->sizes);

		// serialize and unserialize
		$encoded = wp_json_encode($line_item);
		$decoded = json_decode($encoded, true);

		$this->assertSame('attachment-thumbnail size-thumbnail', $decoded['image']['class']);
		$this->assertSame('attachment-thumbnail size-thumbnail', $decoded['image']['class']);
		$this->assertSame('(max-width: 150px) 100vw, 150px', $decoded['image']['sizes']);

		$decoded = json_decode($encoded);

		$this->assertSame('attachment-thumbnail size-thumbnail', $decoded->image->class);
		$this->assertSame('attachment-thumbnail size-thumbnail', $decoded->image->class);
		$this->assertSame('(max-width: 150px) 100vw, 150px', $decoded->image->sizes);
	}
}
