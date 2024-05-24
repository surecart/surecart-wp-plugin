<?php

namespace SureCart\Tests\Models\ProductPost;

use SureCart\Database\Table;
use SureCart\Database\Tables\VariantOptionValues;
use SureCart\Models\Price;
use SureCart\Models\Product;
use SureCart\Models\Variant;
use SureCart\Models\VariantOption;
use SureCart\Models\VariantOptionValue;
use SureCart\Tests\SureCartUnitTestCase;

class ProductPostTest extends SureCartUnitTestCase
{
	public function setUp(): void
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Database\MigrationsServiceProvider::class,
				\SureCart\Settings\SettingsServiceProvider::class,
				\SureCart\WordPress\Taxonomies\TaxonomyServiceProvider::class,
				\SureCart\Sync\SyncServiceProvider::class,
			]
		], false);

		// remove existing.
		(new VariantOptionValues(new Table()))->uninstall();

		// mock the account id.
		\SureCart::alias('account', function () {
			return (object) [
				'id' => 'test',
			];
		});
	}

	/**
	 * @group sync
	 * @group account
	 */
	public function test_has_account_term() {
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

		$terms = get_the_terms($post->ID, 'sc_account');
		$this->assertNotEmpty($terms);
		$this->assertSame('test', $terms[0]->slug);
	}

	/**
	 * @group sync
	 * @group account
	 */
	public function test_should_return_empty_if_account_switches() {
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
	public function test_can_sync_product()
	{
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
	}

	/**
	 * @group sync
	 */
	public function test_creates_variant_option_values_in_database()
	{
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
}
