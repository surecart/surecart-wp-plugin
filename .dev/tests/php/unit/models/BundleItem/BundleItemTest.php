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

	/**
	 * Expanded component_product hydrates into a Product relation, and the
	 * BundleItem's `name` accessor pulls through from it.
	 */
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
		$this->assertSame( 'Trail Tent', $item->name );
	}

	/**
	 * When component_product is just an ID string (not yet expanded), we still
	 * surface the id but don't fabricate a Product object — and `name` should
	 * gracefully return empty rather than throw.
	 */
	public function test_component_product_unexpanded_keeps_id_only() {
		$item = new BundleItem(
			array(
				'id'                => 'bi-2',
				'component_product' => 'p-component-only-id',
			)
		);

		$this->assertSame( 'p-component-only-id', $item->component_product_id );
		$this->assertSame( '', $item->name );
	}

	/**
	 * bundle_product is the parent bundle Product (the one with bundle:true).
	 * The relation hydrates the same way component_product does.
	 */
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

	/**
	 * The line_item_image accessor returns the component product's line_item_image
	 * verbatim when present, or an empty object when the relation isn't expanded.
	 */
	public function test_line_item_image_pulls_from_component_product() {
		$item = new BundleItem(
			array(
				'component_product' => array(
					'id'              => 'p-component',
					'name'            => 'Trail Tent',
					'line_item_image' => array(
						'src'   => 'http://example.com/tent.jpg',
						'width' => 150,
					),
				),
			)
		);

		$this->assertNotEmpty( $item->line_item_image );
		$this->assertSame( 'http://example.com/tent.jpg', $item->line_item_image->src );
	}

	public function test_line_item_image_empty_when_component_unexpanded() {
		$item = new BundleItem(
			array(
				'component_product' => 'just-an-id',
			)
		);

		$this->assertEquals( (object) array(), $item->line_item_image );
	}
}
