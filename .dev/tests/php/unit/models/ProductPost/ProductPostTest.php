<?php

namespace SureCart\Tests\Models\ProductPost;

use SureCart\Background\QueueService;
use SureCart\Database\Table;
use SureCart\Database\Tables\VariantOptionValues;
use SureCart\Models\Price;
use SureCart\Models\Product;
use SureCart\Models\Variant;
use SureCart\Models\VariantOption;
use SureCart\Models\VariantOptionValue;
use SureCart\Request\RequestService;
use SureCart\Sync\SyncService;
use SureCart\Tests\SureCartUnitTestCase;

class ProductPostTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	public function setUp(): void
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Database\MigrationsServiceProvider::class,
				\SureCart\Background\BackgroundServiceProvider::class,
				\SureCart\Settings\SettingsServiceProvider::class,
				\SureCart\WordPress\Taxonomies\TaxonomyServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Account\AccountServiceProvider::class,
				\SureCart\Sync\SyncServiceProvider::class,
				\SureCart\WordPress\PostTypes\PostTypeServiceProvider::class,
				\SureCart\WordPress\Pages\PageServiceProvider::class,
			]
		], false);

		// remove existing.
		(new VariantOptionValues(new Table()))->uninstall();
	}

	/**
	 * @group sync
	 */
	public function test_syncs_taxonomies() {
		$this->markTestIncomplete('This test has not been implemented yet.');
		$sync_service =  \Mockery::mock(SyncService::class)->makePartial();
		\SureCart::alias('sync', function () use ($sync_service) {
			return $sync_service;
		});

		$queue_service =  \Mockery::mock(QueueService::class)->makePartial();
		\SureCart::alias('queue', function () use ($queue_service) {
			return $queue_service;
		});
		$queue_service->shouldReceive('async')->andReturn(true);

		$this->shouldSyncProduct(['testid_2','testid']);
		$product = (new Product(
			[
				"id" => "testid",
				"object" => "product",
				"name" => "Test",
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'product_collections' => (object) [
					'data' => [
						(object) [
							'id' => 'sneakers-id',
							'object' => 'product_collection',
							'name' => 'Sneakers',
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
						(object) [
							'id' => 'shoes-id',
							'object' => 'product_collection',
							'name' => 'Shoes',
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						]
					]
				],
			]
		))->sync();

		$post = $product->post;

		$this->assertInstanceOf(\WP_Post::class, $post);
		$this->assertNotEmpty($post->ID);
		$terms = get_the_terms($post->ID, 'sc_collection');
		$this->assertNotEmpty($terms);
		$this->assertCount(2, $terms);

		$product_2 = (new Product(
			[
				"id" => "testid_2",
				"object" => "product",
				"name" => "Test 2",
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'product_collections' => (object) [
					'data' => [
						(object) [
							'id' => 'dress-shoes-id',
							'object' => 'product_collection',
							'name' => 'Dress Shoes',
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
						(object) [
							'id' => 'shoes-id',
							'object' => 'product_collection',
							'name' => 'Shoes',
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						]
					]
				],
			]
		))->sync();

		$post = $product_2->post;

		$this->assertInstanceOf(\WP_Post::class, $post);
		$this->assertNotEmpty($post->ID);
		$terms = get_the_terms($post->ID, 'sc_collection');
		$this->assertNotEmpty($terms);
		$this->assertCount(2, $terms);

		// check totals
		$this->assertCount(3, get_terms(array(
			'taxonomy'   => 'sc_collection',
			'hide_empty' => false,
		)));

		// check individual terms
		$sneakers = get_term_by('name', 'Sneakers', 'sc_collection');
		$this->assertNotEmpty($sneakers);
		$this->assertSame('sneakers-id', get_term_meta($sneakers->term_id, 'sc_id', true));
		$shoes = get_term_by('name', 'Shoes', 'sc_collection');
		$this->assertNotEmpty($shoes);
		$this->assertSame('shoes-id', get_term_meta($shoes->term_id, 'sc_id', true));
		$dress_shoes = get_term_by('name', 'Dress Shoes', 'sc_collection');
		$this->assertNotEmpty($dress_shoes);
		$this->assertSame('dress-shoes-id', get_term_meta($dress_shoes->term_id, 'sc_id', true));
	}

	/**
	 * @group sync
	 * @group account
	 */
	public function test_has_account_term() {
		$this->shouldSyncProduct('testid');

		// mock the account id.
		\SureCart::alias('account', function () {
			return (object) [
				'id' => 'test',
			];
		});

		$queue_service =  \Mockery::mock(QueueService::class)->makePartial();
		\SureCart::alias('queue', function () use ($queue_service) {
			return $queue_service;
		});
		$queue_service->shouldReceive('async')->andReturn(true);

		$product = (new Product(
			[
				"id" => "testid",
				"object" => "product",
				"name" => "Test",
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'variant_options' => (object) [
					'data' => [
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Size',
							'values' => ['Small', 'Medium', 'Large'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Color',
							'values' => ['Red', 'Green', 'Blue'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						]
					]
				],
			]
		))->sync();

		$post = $product->post;

		$this->assertInstanceOf(\WP_Post::class, $post);
		$this->assertNotEmpty($post->ID);
		$terms = get_terms( array(
			'taxonomy'   => 'sc_account',
			'hide_empty' => false,
		) );

		$this->markTestIncomplete('This test has not been implemented yet.');
		$terms = get_the_terms($post->ID, 'sc_account');
		$this->assertNotEmpty($terms);
		$this->assertCount(1, $terms);
		$this->assertSame('test', $terms[0]->slug);
	}

	/**
	 * @group sync
	 * @group account
	 */
	public function test_should_return_empty_if_account_switches() {
		$this->markTestIncomplete('This test has not been implemented yet.');
		$this->shouldSyncProduct('testid');

		// mock the account id.
		\SureCart::alias('account', function () {
			return (object) [
				'id' => 'test',
			];
		});

		(new Product(
			[
				"id" => "testid",
				"object" => "product",
				"name" => "Test",
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'variant_options' => (object) [
					'data' => [
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Size',
							'values' => ['Small', 'Medium', 'Large'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Color',
							'values' => ['Red', 'Green', 'Blue'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						]
					]
				],
			]
		))->sync();

		// get the product post
		$products = sc_get_products();
		$this->assertCount(1, $products);

		// account changes.
		\SureCart::alias('account', function () {
			return (object) [
				'id' => 'test2',
			];
		});

		// get the product post
		$products = sc_get_products();
		$this->assertCount(0, $products);
	}

	/**
	 * @group sync
	 */
	public function test_syncs_product_directly()
	{
		$this->markTestIncomplete('This test has not been implemented yet.');

		// mock the account id.
		\SureCart::alias('account', function () {
			return (object) [
				'id' => 'test',
			];
		});

		$this->shouldSyncProduct('testid');

		$product = (new Product(
			[
				"id" => "testid",
				"object" => "product",
				"name" => "Other sneakers.",
				"description" => "A pair of fancy sneakers.",
				'slug' => 'fancy-sneakers',
				"archived" => true,
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'product_collections' => (object) [
					'data' => [
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'product_collection',
							'name' => 'Dress Shoes',
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
					]
				],
				'variant_options' => (object) [
					'data' => [
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Size',
							'values' => ['Small', 'Medium', 'Large'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Color',
							'values' => ['Red', 'Green', 'Blue'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						]
					]
				],
				"prices" => [
					"data" => [
						[
							"id" => "00e5bbf1-6a4a-4e94-9e2b-c64b3f0b3645",
							"object" => "price",
							"name" => "Premium",
							"archived" => true,
							"amount" => 9900,
							"currency" => "usd",
							"recurring" => true,
							"recurring_interval" => "month",
							"recurring_interval_count" => 1,
							"product_id" => "00e5bbf1-6a4a-4e94-9e2b-c64b3f0b3645",
							"createdAt" => 1616008115,
							"updatedAt" => 1616008115
						],
						[
							"id" => "00e5bbf1-6a4a-4e94-9e2b-c64b3f0b3645",
							"object" => "price",
							"name" => "Premium",
							"archived" => true,
							"amount" => 9800,
							"currency" => "usd",
							"recurring" => true,
							"recurring_interval" => "month",
							"recurring_interval_count" => 1,
							"product_id" => "00e5bbf1-6a4a-4e94-9e2b-c64b3f0b3645",
							"createdAt" => 1616008115,
							"updatedAt" => 1616008115
						]
					]
				]
			]
		))->sync();

		$post = $product->post;

		$this->assertNotEmpty($post);
		$this->assertSame('testid', $post->sc_id);
		$this->assertSame('Other sneakers.', $post->post_title);
		$this->assertSame('sc_archived', $post->post_status);
		$this->assertSame('fancy-sneakers', $post->post_name);
		$this->assertNotEmpty(get_the_terms($post->ID, 'sc_collection'));
	}

		/**
	 * @group sync
	 */
	public function test_syncs_when_created() {
		$this->shouldSyncProduct('testid');

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests
			->shouldReceive('makeRequest')
			->andReturn((object) [
				"id" => "testid",
				"object" => "product",
				"name" => "Test",
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'featured' => true
			]);

		$this->markTestIncomplete('This test has not been implemented yet.');
		$product = Product::create(['name' => 'Test']);
		$this->assertNotEmpty(get_post($product->post->ID));
	}

	/**
	 * @group sync
	 */
	public function test_syncs_when_updated() {
		$this->shouldSyncProduct('testid');

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests
			->shouldReceive('makeRequest')
			->once()
			->andReturn((object) [
				"id" => "testid",
				"object" => "product",
				"name" => "Test",
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'featured' => true
			]);

		$this->markTestIncomplete('This test has not been implemented yet.');
		$product = Product::update(['id' => 'test', 'name' => 'Test']);
		$this->assertNotEmpty(get_post($product->post->ID));
		$this->assertNotEmpty(get_post_meta($product->post->ID, 'featured', true));
	}

	/**
	 * @group sync
	 */
	public function test_syncs_when_deleted()
	{
		$this->markTestIncomplete('This test has not been implemented yet.');
		$this->shouldSyncProduct('testid');

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests
			->shouldReceive('makeRequest')
			->twice()
			->andReturn((object) [
				"id" => "testid",
				"object" => "product",
				"name" => "Test",
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'featured' => true
			]);

		$product = Product::create(['name' => 'Test']);

		// store the id
		$id = $product->post->ID;

		// delete the product.
		Product::delete('testid');

		// the post should also get deleted.
		$this->assertEmpty(get_post($id));
	}

	/**
	 * @group sync
	 */
	public function test_creates_variant_option_values_in_database()
	{
		$this->markTestIncomplete('This test has not been implemented yet.');
		// mock the account id.
		\SureCart::alias('account', function () {
			return (object) [
				'id' => 'test',
			];
		});

		$this->shouldSyncProduct('testid');

		(new Product(
			[
				"id" => "testid",
				"object" => "product",
				"name" => "Test",
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'variant_options' => (object) [
					'data' => [
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Size',
							'values' => ['Small', 'Medium', 'Large'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Color',
							'values' => ['Red', 'Green', 'Blue'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						]
					]
				],
			]
		))->sync();

		$items = VariantOptionValue::where('product_id', 'testid')->get();
		$this->assertSame(6, count($items));
		foreach ($items as $item) {
			$this->assertSame($item->product_id, 'testid');
		}
	}

	/**
	 * @group sync
	 */
	public function test_multiple_syncs_does_not_create_duplicate_records()
	{
		$this->markTestIncomplete('This test has not been implemented yet.');
		// mock the account id.
		\SureCart::alias('account', function () {
			return (object) [
				'id' => 'test',
			];
		});

		$this->shouldSyncProduct('testid');

		$product = new Product(
			[
				"id" => "testid",
				"object" => "product",
				"name" => "Test",
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'variant_options' => (object) [
					'data' => [
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Size',
							'values' => ['Small', 'Medium', 'Large'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Color',
							'values' => ['Red', 'Green', 'Blue'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						]
					]
				],
			]
		);

		$product->sync();
		$product->sync();

		$products = get_posts([
			'post_type' => 'sc_product',
			'meta_query' => [
				'key' => 'sc_id',
				'value' => 'testid'
			]
		]);

		$this->assertSame(1, count($products));

		$items = VariantOptionValue::where('product_id', 'testid')->get();
		$this->assertSame(6, count($items));
	}

	/**
	 * @group sync
	 * @group variant_options
	 */
	public function test_can_filter_variant_options()
	{
		$this->markTestIncomplete('This test has not been implemented yet.');
		// mock the account id.
		\SureCart::alias('account', function () {
			return (object) [
				'id' => 'test',
			];
		});

		$this->shouldSyncProduct(['testid', 'testid2']);

		$product = new Product(
			[
				"id" => "testid",
				"object" => "product",
				"name" => "Test",
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'variant_options' => (object) [
					'data' => [
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Size',
							'values' => ['Small', 'Medium', 'Large'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Color',
							'values' => ['Red', 'Green', 'Blue'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						]
					]
				],
			]
		);
		$product->sync();

		$product = new Product(
			[
				"id" => "testid2",
				"object" => "product",
				"name" => "Test",
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'variant_options' => (object) [
					'data' => [
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Size',
							'values' => ['Small', 'Medium', 'Large'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Color',
							'values' => ['Orange', 'Red'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						]
					]
				],
			]
		);
		$product->sync();

		$product = sc_get_products([
			'variant_options' => [
				[
					'name' 		=> 'Size',
					'values'    =>  ['Small'],
					'operator' 	=> 'IN',
				]
			],
		]);

		$this->assertCount(2, $product);

		$product = sc_get_products([
			'variant_options' => [
				[
					'name' 		=> 'Color',
					'values'    =>  ['Orange'],
					'operator' 	=> 'IN',
				],
			]
		]);

		$this->assertCount(2, $product);

		$product = sc_get_products([
			'variant_options' => [
				[
					'name' 		=> 'Color',
					'values'    =>  ['Orange', 'Blue'],
					'operator' 	=> 'IN',
				],
			]
		]);

		$this->assertCount(2, $product);

		$product = sc_get_products([
			'variant_options' => [
				'relation' => 'OR',
				[
					'name' 		=> 'Color',
					'values'    =>  ['Orange'],
					'operator' 	=> 'IN',
				],
				[
					'name' 		=> 'Color',
					'values'    =>  ['Blue'],
					'operator' 	=> 'IN',
				],
			]
		]);

		$this->assertCount(2, $product);

		$product = sc_get_products([
			'variant_options' => [
				[
					'name' 		=> 'Color',
					'values'    =>  ['Orange'],
					'operator' 	=> 'IN',
				],
				[
					'name' 		=> 'Color',
					'values'    =>  ['Blue'],
					'operator' 	=> 'IN',
				],
			]
		]);

		$this->assertCount(2, $product);
	}

	/**
	 * @group sync
	 */
	public function test_has_nested_variants() {
		$this->markTestIncomplete('This test has not been implemented yet.');
		$this->shouldSyncProduct('testid2');

		// $queue_service =  \Mockery::mock(QueueService::class)->makePartial();
		// \SureCart::alias('queue', function () use ($queue_service) {
		// 	return $queue_service;
		// });
		// $queue_service
		// 	->shouldReceive('async')
		// 	->andReturn(true);

		$product = new Product(
			[
				"id" => "testid2",
				"object" => "product",
				"name" => "Test",
				"created_at" => 1624910585,
				"updated_at" => 1624910585,
				'prices' => (object) [
					'data' => [
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'price',
							'option_1' => 'Small',
							'option_2' => 'Orange',
							'position' => 1,
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
					]
				],
				'variants' => (object) [
					'data' => [
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant',
							'option_1' => 'Small',
							'option_2' => 'Orange',
							'position' => 1,
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfe1',
							'object' => 'variant',
							'option_1' => 'Small',
							'option_2' => 'Red',
							'position' => 2,
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
					]
				],
				'variant_options' => (object) [
					'data' => [
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Size',
							'values' => ['Small'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
						(object) [
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Color',
							'values' => ['Orange', 'Red'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						]
					]
				],
			]
		);
		$product->sync();

		$post = $product->post;

		$this->assertNotEmpty($post->product->id);
		$this->assertCount(2, $post->product->variants->data);
		foreach($post->product->variants->data as $variant) {
			$this->assertInstanceOf(Variant::class, $variant);
		}
		foreach($post->product->variant_options->data as $option) {
			$this->assertInstanceOf(VariantOption::class, $option);
		}
		foreach($post->product->prices->data as $price) {
			$this->assertInstanceOf(Price::class, $price);
		}
		foreach($post->product as $post->product) {
			$this->assertInstanceOf(\WP_Post::class, $price);
		}
	}

	/**
	 * This tests to make sure that if the stored post updated_at is older
	 * than the model updated_at, then the sync is queued for later.
	 *
	 * @group sync
	 */
	public function test_queues_sync_if_post_type_is_old() {
		$this->markTestIncomplete('This test has not been implemented yet.');
		$this->shouldSyncProduct('testid');

		// mock the requests in the container
		$queue_service =  \Mockery::mock(QueueService::class)->makePartial();
		\SureCart::alias('queue', function () use ($queue_service) {
			return $queue_service;
		});

		$sync_service =  \Mockery::mock(SyncService::class)->makePartial();
		\SureCart::alias('sync', function () use ($sync_service) {
			return $sync_service;
		});

		// it should queue the an async request since the post has not yet been created.
		$queue_service
			->shouldReceive('async')
			->once()
			->with(
				'surecart/sync/product',
				[
					'id' => 'testid',
				],
				'product-testid', // unique id for the product.
				true // force unique. This will replace any existing jobs.
			)->andReturn(true);

		(new Product([
			'id' => 'testid',
			'object' => 'product',
			'name' => 'Test',
			'created_at' => 1111111111,
			'updated_at' => 1111111110
		]))->sync();

		// this should trigger it.
		new Product([
			'id' => 'testid',
			'object' => 'product',
			'name' => 'Test',
			'created_at' => 1111111111,
			'updated_at' => 1111111111
		]);

		// this should not trigger it.
		new Product([
			'id' => 'testid',
			'object' => 'product',
			'name' => 'Test',
			'created_at' => 1111111111,
			'updated_at' => 1111111110
		]);
	}
 }
