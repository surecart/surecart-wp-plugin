<?php

namespace SureCart\Tests\Models\ProductPost;

use SureCart\Database\Table;
use SureCart\Database\Tables\VariantOptionValues;
use SureCart\Models\Product;
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

		// get the product post
		$product = sc_get_product('testid');

		$this->assertNotEmpty($product->ID);
		$terms = get_terms( array(
			'taxonomy'   => 'sc_account',
			'hide_empty' => false,
		) );

		$terms = get_the_terms($product->ID, 'sc_account');
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
				'variant_options' => [
					'data' => [
						[
							'id' => '9f86c425-bed7-45a8-841f-ba5ef5efdfef',
							'object' => 'variant_option',
							'name' => 'Size',
							'values' => ['Small', 'Medium', 'Large'],
							'created_at' => 1624910585,
							'updated_at' => 1624910585
						],
						[
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

		// get the product post
		$product = sc_get_product('testid');

		$this->assertNotEmpty($product);
		$this->assertSame('testid', $product->sc_id);
		$this->assertSame('Other sneakers.', $product->post_title);
		$this->assertSame('sc_archived', $product->post_status);
		$this->assertSame('fancy-sneakers', $product->post_name);
		$this->assertSame($product->prices['data'][0]['amount'], 9900);
		$this->assertSame($product->prices['data'][1]['amount'], 9800);
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
	public function test_can_sync_multiple_times()
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

		$products = sc_get_products([
			'sc_id' => 'testid'
		]);
		$this->assertSame(1, count($products));

		$items = VariantOptionValue::where('product_id', 'testid')->get();
		$this->assertSame(6, count($items));
	}

	/**
	 * @group sync
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

		$this->assertCount(1, $product);

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

		$this->assertCount(0, $product);
	}
}
