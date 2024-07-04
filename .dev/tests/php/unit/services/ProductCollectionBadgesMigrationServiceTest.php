<?php

namespace SureCart\Tests\Services;

use SureCart\BlockLibrary\ProductCollectionBadgesMigrationService;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Test ProductCollectionBadgesMigrationService
 */
class ProductCollectionBadgesMigrationServiceTest extends SureCartUnitTestCase {
	private $service = null;

	/**
	 * Setup
	 */
	public function setUp() : void {
		// set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers'=>[
				\SureCart\BlockLibrary\BlockServiceProvider::class
			]
		],false);

		$attributes = [];
		$block = (object) [
			'parsed_block' => [

			]
		];

		$this->service = new ProductCollectionBadgesMigrationService();
	}
}
