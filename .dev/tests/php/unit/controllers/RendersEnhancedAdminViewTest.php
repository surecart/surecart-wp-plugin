<?php

namespace SureCart\Tests\Controllers;

use SureCart\Controllers\Admin\Products\ProductsController;
use SureCart\Controllers\Admin\ProductCollections\ProductCollectionsController;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Tests for the RendersEnhancedAdminView trait, which is used by multiple controllers and contains shared logic for the enhanced admin views feature flag.
 */
class RendersEnhancedAdminViewTest extends SureCartUnitTestCase {
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

		$this->products_controller            = new ProductsController();
		$this->product_collections_controller = new ProductCollectionsController();
	}

	public function tearDown(): void {
		delete_option( 'surecart_enhanced_admin_views' );
		parent::tearDown();
	}

	/**
	 * Default state: no option stored → legacy branch is active for both controllers.
	 *
	 * @group admin-views
	 */
	public function test_flag_is_off_by_default() {
		delete_option( 'surecart_enhanced_admin_views' );

		$this->assertFalse( $this->products_controller->isEnhancedAdminViewsEnabled() );
		$this->assertFalse( $this->product_collections_controller->isEnhancedAdminViewsEnabled() );
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
	 * @group admin-views
	 */
	public function test_flag_is_off_when_option_disabled() {
		update_option( 'surecart_enhanced_admin_views', false );

		$this->assertFalse( $this->products_controller->isEnhancedAdminViewsEnabled() );
		$this->assertFalse( $this->product_collections_controller->isEnhancedAdminViewsEnabled() );
	}
}
