<?php

namespace SureCart\Tests\Models\LineItem;

use SureCart\Models\LineItem;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * @group line_item
 * @group bundle
 */
class LineItemBundleTest extends SureCartUnitTestCase {
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

	public function test_is_bundle_parent_false_for_regular_product() {
		$item = new LineItem(
			array(
				'component_line_item' => false,
				'price'               => array(
					'product' => array(
						'id'     => 'p-regular',
						'bundle' => false,
					),
				),
			)
		);

		$this->assertFalse( $item->is_bundle_parent );
	}

	public function test_is_bundle_parent_true_when_product_is_bundle() {
		$item = new LineItem(
			array(
				'component_line_item' => false,
				'price'               => array(
					'product' => array(
						'id'     => 'p-bundle',
						'bundle' => true,
					),
				),
			)
		);

		$this->assertTrue( $item->is_bundle_parent );
	}

	/**
	 * `component_line_item: true` short-circuits — a component is never the parent,
	 * even if its product happens to be a bundle.
	 */
	public function test_is_bundle_parent_false_when_component_line_item_is_true() {
		$item = new LineItem(
			array(
				'component_line_item' => true,
				'price'               => array(
					'product' => array(
						'id'     => 'p-bundle',
						'bundle' => true,
					),
				),
			)
		);

		$this->assertFalse( $item->is_bundle_parent );
	}

	/**
	 * Missing price.product expansion should bail to false, not throw.
	 */
	public function test_is_bundle_parent_false_when_price_not_expanded() {
		$item = new LineItem(
			array(
				'component_line_item' => false,
				// price not expanded — string id only
				'price'               => 'price-id-without-expansion',
			)
		);

		$this->assertFalse( $item->is_bundle_parent );
	}

	public function test_is_bundle_component_true_when_flag_set() {
		$item = new LineItem(
			array(
				'component_line_item' => true,
			)
		);

		$this->assertTrue( $item->is_bundle_component );
	}

	public function test_is_bundle_component_false_when_flag_unset() {
		$item = new LineItem(
			array(
				'component_line_item' => false,
			)
		);

		$this->assertFalse( $item->is_bundle_component );
	}

	/**
	 * Setter must coerce non-arrays to `[]` — downstream consumers expect array shape.
	 */
	public function test_bundle_component_variants_setter_coerces_to_array() {
		$item = new LineItem(
			array(
				'bundle_component_variants' => array(
					'product-a' => 'variant-1',
					'product-b' => 'variant-2',
				),
			)
		);

		$this->assertSame(
			array(
				'product-a' => 'variant-1',
				'product-b' => 'variant-2',
			),
			$item->bundle_component_variants
		);

		// Defensive: a non-array (e.g. null) must coerce to [].
		$item2 = new LineItem( array( 'bundle_component_variants' => null ) );
		$this->assertSame( array(), $item2->bundle_component_variants );
	}
}
