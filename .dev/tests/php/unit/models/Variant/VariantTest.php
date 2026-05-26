<?php

namespace SureCart\Tests\Models\Variant;

use SureCart\Models\Variant;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * @group variant
 * @group stock
 */
class VariantTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	public function setUp(): void {
		parent::setUp();

		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCartAppCore\AppCore\AppCoreServiceProvider::class,
					\SureCartAppCore\Config\ConfigServiceProvider::class,
					\SureCart\WordPress\PluginServiceProvider::class,
					\SureCart\Settings\SettingsServiceProvider::class,
					\SureCart\Request\RequestServiceProvider::class,
				],
			],
			false
		);
	}

	/**
	 * When stock_enabled is null (not set on variant), has_unlimited_stock should return null
	 * so callers can fall back to the product.
	 */
	public function test_has_unlimited_stock_returns_null_when_stock_enabled_is_null() {
		$variant = new Variant( [
			'id'            => 'var_1',
			'stock_enabled' => null,
		] );

		$this->assertNull( $variant->has_unlimited_stock );
	}

	/**
	 * When stock_enabled is false, stock is not tracked — unlimited.
	 */
	public function test_has_unlimited_stock_returns_true_when_stock_not_enabled() {
		$variant = new Variant( [
			'id'            => 'var_2',
			'stock_enabled' => false,
		] );

		$this->assertTrue( $variant->has_unlimited_stock );
	}

	/**
	 * When stock_enabled is true and allow_out_of_stock_purchases is true, still unlimited.
	 */
	public function test_has_unlimited_stock_returns_true_when_allow_out_of_stock() {
		$variant = new Variant( [
			'id'                           => 'var_3',
			'stock_enabled'                => true,
			'allow_out_of_stock_purchases' => true,
		] );

		$this->assertTrue( $variant->has_unlimited_stock );
	}

	/**
	 * When stock_enabled is true and allow_out_of_stock_purchases is false, stock IS tracked.
	 */
	public function test_has_unlimited_stock_returns_false_when_stock_enabled_and_no_oos() {
		$variant = new Variant( [
			'id'                           => 'var_4',
			'stock_enabled'                => true,
			'allow_out_of_stock_purchases' => false,
		] );

		$this->assertFalse( $variant->has_unlimited_stock );
	}
}
