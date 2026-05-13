<?php

namespace SureCart\Tests\Models\Blocks;

use SureCart\Models\Blocks\ProductPageBlock;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * @group stock
 * @group product-page-block
 */
class ProductPageBlockTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Helper to call the private static effectiveVariantStock method.
	 */
	private function callEffectiveVariantStock( array $variant, array $product ): int {
		$ref = new \ReflectionMethod( ProductPageBlock::class, 'effectiveVariantStock' );
		$ref->setAccessible( true );
		return $ref->invoke( null, $variant, $product );
	}

	/**
	 * Helper to call the private static isVariantGroupSoldOut method.
	 */
	private function callIsVariantGroupSoldOut( array $items, array $product ): bool {
		$ref = new \ReflectionMethod( ProductPageBlock::class, 'isVariantGroupSoldOut' );
		$ref->setAccessible( true );
		return $ref->invoke( null, $items, $product );
	}

	/**
	 * Variant has unlimited stock → returns PHP_INT_MAX.
	 */
	public function test_effective_stock_unlimited_when_variant_has_unlimited() {
		$result = $this->callEffectiveVariantStock(
			[ 'has_unlimited_stock' => true, 'available_stock' => 0 ],
			[ 'has_unlimited_stock' => false ]
		);

		$this->assertSame( PHP_INT_MAX, $result );
	}

	/**
	 * Variant has_unlimited_stock is null → falls back to product.
	 */
	public function test_effective_stock_falls_back_to_product_unlimited() {
		$result = $this->callEffectiveVariantStock(
			[ 'has_unlimited_stock' => null, 'available_stock' => 5 ],
			[ 'has_unlimited_stock' => true ]
		);

		$this->assertSame( PHP_INT_MAX, $result );
	}

	/**
	 * Variant has_unlimited_stock null, product also not unlimited → uses available_stock.
	 */
	public function test_effective_stock_returns_available_stock_when_tracked() {
		$result = $this->callEffectiveVariantStock(
			[ 'has_unlimited_stock' => null, 'available_stock' => 7 ],
			[ 'has_unlimited_stock' => false ]
		);

		$this->assertSame( 7, $result );
	}

	/**
	 * Variant explicitly not unlimited → returns available_stock.
	 */
	public function test_effective_stock_variant_overrides_product() {
		$result = $this->callEffectiveVariantStock(
			[ 'has_unlimited_stock' => false, 'available_stock' => 3 ],
			[ 'has_unlimited_stock' => true ]
		);

		$this->assertSame( 3, $result );
	}

	/**
	 * Both missing has_unlimited_stock → defaults to false (stock-tracked) for safety.
	 */
	public function test_effective_stock_defaults_tracked_when_both_missing() {
		$result = $this->callEffectiveVariantStock(
			[ 'available_stock' => 0 ],
			[]
		);

		$this->assertSame( 0, $result );
	}

	/**
	 * Zero stock and not unlimited → returns 0.
	 */
	public function test_effective_stock_zero_when_sold_out() {
		$result = $this->callEffectiveVariantStock(
			[ 'has_unlimited_stock' => false, 'available_stock' => 0 ],
			[ 'has_unlimited_stock' => false ]
		);

		$this->assertSame( 0, $result );
	}

	/**
	 * Empty group → not sold out (no matching variants).
	 */
	public function test_empty_group_not_sold_out() {
		$result = $this->callIsVariantGroupSoldOut(
			[],
			[ 'has_unlimited_stock' => false ]
		);

		$this->assertFalse( $result );
	}

	/**
	 * All variants in group have zero stock → sold out.
	 */
	public function test_all_zero_stock_is_sold_out() {
		$result = $this->callIsVariantGroupSoldOut(
			[
				[ 'has_unlimited_stock' => false, 'available_stock' => 0 ],
				[ 'has_unlimited_stock' => false, 'available_stock' => 0 ],
			],
			[ 'has_unlimited_stock' => false ]
		);

		$this->assertTrue( $result );
	}

	/**
	 * At least one variant has stock → not sold out.
	 */
	public function test_one_in_stock_not_sold_out() {
		$result = $this->callIsVariantGroupSoldOut(
			[
				[ 'has_unlimited_stock' => false, 'available_stock' => 0 ],
				[ 'has_unlimited_stock' => false, 'available_stock' => 5 ],
			],
			[ 'has_unlimited_stock' => false ]
		);

		$this->assertFalse( $result );
	}

	/**
	 * Variant with unlimited stock in the group → not sold out even if others are zero.
	 */
	public function test_unlimited_variant_prevents_sold_out() {
		$result = $this->callIsVariantGroupSoldOut(
			[
				[ 'has_unlimited_stock' => false, 'available_stock' => 0 ],
				[ 'has_unlimited_stock' => true, 'available_stock' => 0 ],
			],
			[ 'has_unlimited_stock' => false ]
		);

		$this->assertFalse( $result );
	}

	/**
	 * Variant inherits unlimited from product → not sold out.
	 */
	public function test_inherited_unlimited_prevents_sold_out() {
		$result = $this->callIsVariantGroupSoldOut(
			[
				[ 'has_unlimited_stock' => null, 'available_stock' => 0 ],
			],
			[ 'has_unlimited_stock' => true ]
		);

		$this->assertFalse( $result );
	}

	/**
	 * Inherited sold-out: variants with null has_unlimited_stock, product stock-tracked, zero stock.
	 */
	public function test_inherited_sold_out_when_product_tracked() {
		$result = $this->callIsVariantGroupSoldOut(
			[
				[ 'has_unlimited_stock' => null, 'available_stock' => 0 ],
				[ 'has_unlimited_stock' => null, 'available_stock' => 0 ],
			],
			[ 'has_unlimited_stock' => false ]
		);

		$this->assertTrue( $result );
	}

	/**
	 * Mixed inherited: one variant inherits sold-out, another has stock.
	 */
	public function test_mixed_inherited_not_sold_out() {
		$result = $this->callIsVariantGroupSoldOut(
			[
				[ 'has_unlimited_stock' => null, 'available_stock' => 0 ],
				[ 'has_unlimited_stock' => null, 'available_stock' => 3 ],
			],
			[ 'has_unlimited_stock' => false ]
		);

		$this->assertFalse( $result );
	}
}
