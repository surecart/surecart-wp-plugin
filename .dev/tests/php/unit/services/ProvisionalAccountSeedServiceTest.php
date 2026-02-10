<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Account\ProvisionalAccountSeedService;

class ProvisionalAccountSeedServiceTest extends SureCartUnitTestCase {
	/**
	 * The service instance.
	 *
	 * @var ProvisionalAccountSeedService
	 */
	protected $service;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCart\WordPress\PluginServiceProvider::class,
					\SureCart\Account\AccountServiceProvider::class,
					\SureCart\Request\RequestServiceProvider::class,
				],
			],
			false
		);

		// Create a new instance of the service.
		$this->service = new ProvisionalAccountSeedService();
	}

	/**
	 * Test extraction of collections from multiple products with deduplication.
	 *
	 * @group account
	 */
	public function test_extract_collections_with_valid_products() {
		$products = [
			[
				'name'                 => 'Product 1',
				'product_collections'  => [
					[
						'slug' => 'collection-1',
						'name' => 'Collection 1',
					],
					[
						'slug' => 'collection-2',
						'name' => 'Collection 2',
					],
				],
			],
			[
				'name'                 => 'Product 2',
				'product_collections'  => [
					[
						'slug' => 'collection-2', // Duplicate - should deduplicate.
						'name' => 'Collection 2',
					],
					[
						'slug' => 'collection-3',
						'name' => 'Collection 3',
					],
				],
			],
		];

		[ $collections, $transformed_products ] = $this->service->extractCollections( $products );

		// Should have 3 unique collections.
		$this->assertCount( 3, $collections );
		$this->assertSame( 'Collection 1', $collections[0]['name'] );
		$this->assertSame( 'Collection 2', $collections[1]['name'] );
		$this->assertSame( 'Collection 3', $collections[2]['name'] );

		// Both products should have collection slugs added.
		$this->assertCount( 2, $transformed_products );
		$this->assertArrayHasKey( 'product_collection_slugs', $transformed_products[0] );
		$this->assertArrayHasKey( 'product_collection_slugs', $transformed_products[1] );

		// First product should have 2 collection slugs.
		$this->assertCount( 2, $transformed_products[0]['product_collection_slugs'] );
		$this->assertContains( 'collection-1', $transformed_products[0]['product_collection_slugs'] );
		$this->assertContains( 'collection-2', $transformed_products[0]['product_collection_slugs'] );

		// Second product should have 2 collection slugs.
		$this->assertCount( 2, $transformed_products[1]['product_collection_slugs'] );
		$this->assertContains( 'collection-2', $transformed_products[1]['product_collection_slugs'] );
		$this->assertContains( 'collection-3', $transformed_products[1]['product_collection_slugs'] );

		// Original product_collections should be removed from products.
		$this->assertArrayNotHasKey( 'product_collections', $transformed_products[0] );
		$this->assertArrayNotHasKey( 'product_collections', $transformed_products[1] );
	}

	/**
	 * Test extraction with products that have no collections.
	 *
	 * @group account
	 */
	public function test_extract_collections_without_collections() {
		$products = [
			[
				'name' => 'Product 1',
			],
			[
				'name' => 'Product 2',
			],
		];

		[ $collections, $transformed_products ] = $this->service->extractCollections( $products );

		$this->assertCount( 0, $collections );
		$this->assertCount( 2, $transformed_products );
		$this->assertSame( 'Product 1', $transformed_products[0]['name'] );
		$this->assertSame( 'Product 2', $transformed_products[1]['name'] );
		$this->assertArrayNotHasKey( 'product_collection_slugs', $transformed_products[0] );
		$this->assertArrayNotHasKey( 'product_collection_slugs', $transformed_products[1] );
	}

	/**
	 * Test extraction with empty input array.
	 *
	 * @group account
	 */
	public function test_extract_collections_with_empty_input() {
		[ $collections, $transformed_products ] = $this->service->extractCollections( [] );

		$this->assertCount( 0, $collections );
		$this->assertCount( 0, $transformed_products );
	}

	/**
	 * Test deduplication keeps last occurrence when duplicate slugs exist.
	 *
	 * @group account
	 */
	public function test_deduplication_keeps_last_occurrence() {
		$products = [
			[
				'name'                 => 'Product 1',
				'product_collections'  => [
					[
						'slug' => 'collection-1',
						'name' => 'Collection 1',
					],
				],
			],
			[
				'name'                 => 'Product 2',
				'product_collections'  => [
					[
						'slug' => 'collection-1',
						'name' => 'Collection 1 Updated',
					],
				],
			],
		];

		[ $collections, $transformed_products ] = $this->service->extractCollections( $products );

		$this->assertCount( 1, $collections );
		$this->assertSame( 'Collection 1 Updated', $collections[0]['name'] );
		$this->assertSame( 'collection-1', $collections[0]['slug'] );
	}

	/**
	 * Test extraction with mixed products (some with collections, some without).
	 *
	 * @group account
	 */
	public function test_extract_collections_with_mixed_products() {
		$products = [
			[
				'name'                 => 'Product 1',
				'product_collections'  => [
					[
						'slug' => 'collection-1',
						'name' => 'Collection 1',
					],
				],
			],
			[
				'name' => 'Product 2', // No collections.
			],
			[
				'name'                 => 'Product 3',
				'product_collections'  => [
					[
						'slug' => 'collection-2',
						'name' => 'Collection 2',
					],
				],
			],
		];

		[ $collections, $transformed_products ] = $this->service->extractCollections( $products );

		$this->assertCount( 2, $collections );
		$this->assertCount( 3, $transformed_products );

		// First and third products should have collection slugs.
		$this->assertArrayHasKey( 'product_collection_slugs', $transformed_products[0] );
		$this->assertArrayHasKey( 'product_collection_slugs', $transformed_products[2] );

		// Second product should NOT have collection slugs.
		$this->assertArrayNotHasKey( 'product_collection_slugs', $transformed_products[1] );
	}

	/**
	 * Test that empty product_collections array is treated as no collections.
	 *
	 * @group account
	 */
	public function test_extract_collections_with_empty_product_collections_array() {
		$products = [
			[
				'name'                 => 'Product 1',
				'product_collections'  => [],
			],
		];

		[ $collections, $transformed_products ] = $this->service->extractCollections( $products );

		$this->assertCount( 0, $collections );
		$this->assertArrayNotHasKey( 'product_collection_slugs', $transformed_products[0] );
	}

	/**
	 * Test that collection slugs maintain their original order.
	 *
	 * @group account
	 */
	public function test_collection_slugs_maintain_order() {
		$products = [
			[
				'name'                 => 'Product 1',
				'product_collections'  => [
					[
						'slug' => 'collection-3',
						'name' => 'Collection 3',
					],
					[
						'slug' => 'collection-1',
						'name' => 'Collection 1',
					],
					[
						'slug' => 'collection-2',
						'name' => 'Collection 2',
					],
				],
			],
		];

		[ $collections, $transformed_products ] = $this->service->extractCollections( $products );

		$this->assertSame(
			[ 'collection-3', 'collection-1', 'collection-2' ],
			$transformed_products[0]['product_collection_slugs']
		);
	}

	/**
	 * Test that all collection attributes are preserved during extraction.
	 *
	 * @group account
	 */
	public function test_collections_preserve_all_attributes() {
		$products = [
			[
				'name'                 => 'Product 1',
				'product_collections'  => [
					[
						'slug'        => 'collection-1',
						'name'        => 'Collection 1',
						'description' => 'Test description',
						'custom_attr' => 'custom_value',
					],
				],
			],
		];

		[ $collections, $transformed_products ] = $this->service->extractCollections( $products );

		$this->assertSame( 'collection-1', $collections[0]['slug'] );
		$this->assertSame( 'Collection 1', $collections[0]['name'] );
		$this->assertSame( 'Test description', $collections[0]['description'] );
		$this->assertSame( 'custom_value', $collections[0]['custom_attr'] );
	}
}
