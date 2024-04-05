<?php

namespace SureCart\Tests\Models\ProductPost;

use SureCart\Models\Product;
use SureCart\Models\ProductPost;

class ProductPostTest extends SureCartUnitTestCase {
	public function setUp() : void {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Database\MigrationsServiceProvider::class,
			]
		], false);
	}

	/**
	 * @group failing
	 */
	public function test_sync() {
		$product = new Product([

		]);
	}
}
