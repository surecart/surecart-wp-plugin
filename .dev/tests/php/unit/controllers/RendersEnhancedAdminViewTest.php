<?php

namespace SureCart\Tests\Controllers;

use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use SureCart\Controllers\Admin\Products\ProductsController;
use SureCart\Controllers\Admin\ProductCollections\ProductCollectionsController;
use SureCart\Sync\ImportState;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Tests for the RendersEnhancedAdminView trait, which is used by multiple controllers and contains shared logic for the enhanced admin views feature flag.
 */
class RendersEnhancedAdminViewTest extends SureCartUnitTestCase {
	use MockeryPHPUnitIntegration;

	/**
	 * @var ProductsController
	 */
	protected $products_controller;

	/**
	 * @var ProductCollectionsController
	 */
	protected $product_collections_controller;

	public function setUp(): void {
		parent::setUp();

		// `ImportState` is `final`, so Mockery can't proxy it. Pass a real
		// instance — the trait tests never hit `importResults()` where it
		// would actually be exercised.
		$this->products_controller            = new ProductsController( new ImportState( 'woo' ) );
		$this->product_collections_controller = new ProductCollectionsController();
	}

	public function tearDown(): void {
		delete_option( 'surecart_enhanced_admin_views' );
		parent::tearDown();
	}

	/**
	 * Default state: no option stored → SPA branch is active for both controllers.
	 * The modern DataView is the new default; users opt out by toggling it off.
	 *
	 * @group admin-views
	 */
	public function test_flag_is_on_by_default() {
		delete_option( 'surecart_enhanced_admin_views' );

		$this->assertTrue( $this->products_controller->isEnhancedAdminViewsEnabled() );
		$this->assertTrue( $this->product_collections_controller->isEnhancedAdminViewsEnabled() );
	}

	/**
	 * Enabling the option flips both controllers to the SPA branch.
	 *
	 * @group admin-views
	 */
	public function test_flag_is_on_when_option_enabled() {
		update_option( 'surecart_enhanced_admin_views', true );

		$this->assertTrue( $this->products_controller->isEnhancedAdminViewsEnabled() );
		$this->assertTrue( $this->product_collections_controller->isEnhancedAdminViewsEnabled() );
	}

	/**
	 * Disabling the option returns both controllers to the legacy branch.
	 *
	 * Stored as int `0` rather than boolean `false`: `update_option(name, false)`
	 * on a never-set option is a no-op because WP treats the implicit
	 * `$old_value = false` as already-equal and skips the write.
	 *
	 * @group admin-views
	 */
	public function test_flag_is_off_when_option_disabled() {
		update_option( 'surecart_enhanced_admin_views', 0 );

		$this->assertFalse( $this->products_controller->isEnhancedAdminViewsEnabled() );
		$this->assertFalse( $this->product_collections_controller->isEnhancedAdminViewsEnabled() );
	}

	/**
	 * When the flag is on, `index()` dispatches to `renderSpaView()` and
	 * never touches the legacy branch.
	 *
	 * @group admin-views
	 */
	public function test_index_routes_to_spa_when_flag_is_on() {
		update_option( 'surecart_enhanced_admin_views', true );

		$controller = Mockery::mock( ProductsController::class, [ new ImportState( 'woo' ) ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$controller->shouldReceive( 'renderSpaView' )->once()->andReturn( 'spa-response' );
		$controller->shouldNotReceive( 'renderWpListView' );

		$this->assertSame( 'spa-response', $controller->index() );
	}

	/**
	 * When the flag is off, `index()` dispatches to `renderWpListView()` and
	 * never touches the SPA branch. The option must be explicitly set to a
	 * falsy non-`false` value — the absence of the option now defaults to the
	 * SPA, and `update_option(name, false)` on an unset option is a no-op
	 * (WP skips the write when the new value equals the implicit default).
	 *
	 * @group admin-views
	 */
	public function test_index_routes_to_legacy_when_flag_is_off() {
		update_option( 'surecart_enhanced_admin_views', 0 );

		$controller = Mockery::mock( ProductCollectionsController::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$controller->shouldReceive( 'renderWpListView' )->once()->andReturn( 'legacy-response' );
		$controller->shouldNotReceive( 'renderSpaView' );

		$this->assertSame( 'legacy-response', $controller->index() );
	}
}
