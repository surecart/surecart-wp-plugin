<?php

namespace SureCart\Tests\Models\BundleItem;

use SureCart\Models\BundleItem;
use SureCart\Models\Product;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * @group bundle
 * @group bundle_item
 */
class BundleItemTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	public function setUp(): void {
		\SureCart::make()->bootstrap(
			array(
				'providers' => array(
					\SureCart\WordPress\PluginServiceProvider::class,
					\SureCart\Settings\SettingsServiceProvider::class,
					\SureCart\Request\RequestServiceProvider::class,
					\SureCart\Account\AccountServiceProvider::class,
				),
			),
			false
		);

		parent::setUp();
	}

	public function test_component_product_relation_hydrates() {
		$item = new BundleItem(
			array(
				'id'                => 'bi-1',
				'quantity'          => 2,
				'component_product' => array(
					'id'   => 'p-component',
					'name' => 'Trail Tent',
				),
			)
		);

		$this->assertInstanceOf( Product::class, $item->component_product );
		$this->assertSame( 'p-component', $item->component_product_id );
	}

	/**
	 * Unexpanded relation: keep the id, no Product hydration.
	 */
	public function test_component_product_unexpanded_keeps_id_only() {
		$item = new BundleItem(
			array(
				'id'                => 'bi-2',
				'component_product' => 'p-component-only-id',
			)
		);

		$this->assertSame( 'p-component-only-id', $item->component_product_id );
	}

	public function test_component_variants_collection_hydrates() {
		$item = new BundleItem(
			array(
				'id'                 => 'bi-cv',
				'component_variants' => (object) array(
					'object' => 'list',
					'data'   => array(
						array(
							'id'              => 'v1',
							'option_1'        => 'Small',
							'available_stock' => 10,
						),
						array(
							'id'              => 'v2',
							'option_1'        => 'Large',
							'available_stock' => 0,
						),
					),
				),
			)
		);

		$this->assertCount( 2, $item->component_variants->data );
		$this->assertInstanceOf( \SureCart\Models\Variant::class, $item->component_variants->data[0] );
		$this->assertSame( 'v1', $item->component_variants->data[0]->id );
		$this->assertSame( 10, $item->component_variants->data[0]->available_stock );
	}

	public function test_component_variant_options_collection_hydrates() {
		$item = new BundleItem(
			array(
				'id'                        => 'bi-cvo',
				'component_variant_options' => (object) array(
					'object' => 'list',
					'data'   => array(
						array(
							'name'   => 'Size',
							'values' => array( 'Small', 'Large' ),
						),
					),
				),
			)
		);

		$this->assertCount( 1, $item->component_variant_options->data );
		$this->assertInstanceOf( \SureCart\Models\VariantOption::class, $item->component_variant_options->data[0] );
		$this->assertSame( 'Size', $item->component_variant_options->data[0]->name );
	}

	public function test_bundle_product_relation_hydrates() {
		$item = new BundleItem(
			array(
				'id'             => 'bi-3',
				'bundle_product' => array(
					'id'     => 'p-bundle',
					'name'   => 'Camping Kit',
					'bundle' => true,
				),
			)
		);

		$this->assertInstanceOf( Product::class, $item->bundle_product );
		$this->assertSame( 'p-bundle', $item->bundle_product_id );
		$this->assertTrue( (bool) $item->bundle_product->bundle );
	}
}
