<?php

namespace SureCart\Tests\Services;

use SureCart\Models\Product;
use SureCart\Settings\SettingsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\Sitemap\ProductSiteMap;

class ProductSiteMapServiceTest extends SureCartUnitTestCase {
	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				SettingsServiceProvider::class
			]
		], false);
	}

	/**
	 * @group sitemap
	 */
	public function test_get_max_num_pages() {
		$service = \Mockery::mock(ProductSiteMap::class)->shouldAllowMockingProtectedMethods()->makePartial();
		$service->shouldReceive('get_products')->once()->andReturn((object)['pagination' => (object)['count' => 200]]);
		$this->assertEquals(2, $service->get_max_num_pages());
	}

	/**
	 * @group sitemap
	 */
	public function test_get_url_list() {
		$service = \Mockery::mock(ProductSiteMap::class)->shouldAllowMockingProtectedMethods()->makePartial();
		$service->shouldReceive('get_products')->once()->andReturn(
			(object)['data' => [
				new Product([
					'id' => 'asdf',
					'slug' => 'test',
				]),
				new Product([
					'id' => 'jklk',
					'slug' => 'test2',
				]),
			]
		]);

		$this->assertEquals([
			[
				'loc' => 'http://localhost:8889/products/test'
			],
			[
				'loc' => 'http://localhost:8889/products/test2',
			]
		], $service->get_url_list(1, ''));
	}
}
