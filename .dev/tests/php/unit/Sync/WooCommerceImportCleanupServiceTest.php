<?php
/**
 * WooCommerceImportCleanupService unit tests.
 *
 * @group woocommerce-import-cleanup
 */

namespace SureCart\Tests\Sync;

use SureCart\Models\Product;
use SureCart\Sync\WooCommerce\WooCommerceImportCleanupService;
use SureCart\Sync\WooCommerce\WooCommerceImportService;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Tests for WooCommerceImportCleanupService.
 *
 * @group woocommerce-import-cleanup
 */
class WooCommerceImportCleanupServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * The service under test.
	 *
	 * @var WooCommerceImportCleanupService
	 */
	private WooCommerceImportCleanupService $service;

	/**
	 * Set up the test environment.
	 */
	public function setUp(): void {
		parent::setUp();

		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCart\WordPress\PluginServiceProvider::class,
				],
			],
			false
		);

		$this->service = new WooCommerceImportCleanupService();

		// Clear throttle transients to prevent test interference.
		delete_transient( 'sc_woo_import_purge_checked' );
		delete_transient( 'sc_woo_import_excluded_ids' );
	}

	/**
	 * Test that meta is cleared when a SC product with wc_product_id is deleted.
	 */
	public function test_clears_meta_when_sc_product_with_wc_product_id_is_deleted() {
		// Create a WC product post.
		$wc_product_id = $this->factory()->post->create( [ 'post_type' => 'product' ] );
		update_post_meta( $wc_product_id, '_surecart_imported', time() );

		// Confirm meta exists.
		$this->assertNotEmpty( get_post_meta( $wc_product_id, '_surecart_imported', true ) );

		// Create a Product model with metadata containing wc_product_id (object format).
		$product = new Product(
			(object) [
				'id'       => 'prod_test_123',
				'metadata' => (object) [
					'wc_product_id' => $wc_product_id,
				],
			]
		);

		$this->service->handleProductDeleted( $product );

		// Meta should be cleared.
		$this->assertEmpty( get_post_meta( $wc_product_id, '_surecart_imported', true ) );
	}

	/**
	 * Test that nothing happens for non-WC-imported products (no wc_product_id).
	 */
	public function test_does_nothing_for_non_wc_imported_products() {
		$product = new Product(
			(object) [
				'id'       => 'prod_native_123',
				'metadata' => (object) [
					'some_other_key' => 'value',
				],
			]
		);

		// Should not throw or error.
		$this->service->handleProductDeleted( $product );
		$this->assertTrue( true ); // No exception means pass.
	}

	/**
	 * Test that nothing happens when the WC product doesn't exist.
	 */
	public function test_does_nothing_when_wc_product_does_not_exist() {
		$product = new Product(
			(object) [
				'id'       => 'prod_test_456',
				'metadata' => (object) [
					'wc_product_id' => 999999,
				],
			]
		);

		// Should not throw or error.
		$this->service->handleProductDeleted( $product );
		$this->assertTrue( true );
	}

	/**
	 * Test that the transient cache is cleared.
	 */
	public function test_clears_transient_cache() {
		$wc_product_id = $this->factory()->post->create( [ 'post_type' => 'product' ] );
		update_post_meta( $wc_product_id, '_surecart_imported', time() );
		set_transient( 'sc_woo_import_excluded_ids', [ $wc_product_id ], HOUR_IN_SECONDS );

		$product = new Product(
			(object) [
				'id'       => 'prod_test_789',
				'metadata' => (object) [
					'wc_product_id' => $wc_product_id,
				],
			]
		);

		$this->service->handleProductDeleted( $product );

		$this->assertFalse( get_transient( 'sc_woo_import_excluded_ids' ) );
	}

	/**
	 * Test that metadata as an array is also handled.
	 */
	public function test_handles_metadata_as_array() {
		$wc_product_id = $this->factory()->post->create( [ 'post_type' => 'product' ] );
		update_post_meta( $wc_product_id, '_surecart_imported', time() );

		$product = new Product(
			(object) [
				'id'       => 'prod_test_arr',
				'metadata' => [
					'wc_product_id' => $wc_product_id,
				],
			]
		);

		$this->service->handleProductDeleted( $product );

		$this->assertEmpty( get_post_meta( $wc_product_id, '_surecart_imported', true ) );
	}

	/**
	 * Test that nothing happens when metadata is empty/null.
	 */
	public function test_does_nothing_when_metadata_is_empty() {
		$product = new Product(
			(object) [
				'id'       => 'prod_no_meta',
				'metadata' => null,
			]
		);

		$this->service->handleProductDeleted( $product );
		$this->assertTrue( true );
	}

	/**
	 * Test that webhook handler resets the purge throttle transient.
	 */
	public function test_clears_purge_throttle_transient() {
		$wc_product_id = $this->factory()->post->create( [ 'post_type' => 'product' ] );
		update_post_meta( $wc_product_id, '_surecart_imported', time() );
		set_transient( 'sc_woo_import_purge_checked', true, 6 * HOUR_IN_SECONDS );

		$product = new Product(
			(object) [
				'id'       => 'prod_test_purge',
				'metadata' => (object) [
					'wc_product_id' => $wc_product_id,
				],
			]
		);

		$this->service->handleProductDeleted( $product );

		$this->assertFalse( get_transient( 'sc_woo_import_purge_checked' ) );
	}

	/**
	 * Test that non-product post types are not affected.
	 * Uses wpdb directly to avoid taxonomy hooks that need full app bootstrap.
	 */
	public function test_does_nothing_for_non_product_post_type() {
		global $wpdb;

		// Insert a regular 'post' directly to avoid taxonomy hook side effects.
		$wpdb->insert(
			$wpdb->posts,
			[
				'post_type'   => 'post',
				'post_status' => 'publish',
				'post_title'  => 'Test Post',
			]
		);
		$post_id = (int) $wpdb->insert_id;

		update_post_meta( $post_id, '_surecart_imported', time() );

		$product = new Product(
			(object) [
				'id'       => 'prod_test_wrong_type',
				'metadata' => (object) [
					'wc_product_id' => $post_id,
				],
			]
		);

		$this->service->handleProductDeleted( $product );

		// Meta should NOT be cleared since it's not a WC product.
		$this->assertNotEmpty( get_post_meta( $post_id, '_surecart_imported', true ) );

		// Clean up via wpdb to avoid taxonomy hook side effects.
		$wpdb->delete( $wpdb->posts, [ 'ID' => $post_id ] );
		$wpdb->delete( $wpdb->postmeta, [ 'post_id' => $post_id ] );
	}

	// ──────────────────────────────────────────────────
	// Layer 2: Fallback purge tests (WooCommerceImportService).
	// ──────────────────────────────────────────────────

	/**
	 * Helper: create a testable WooCommerceImportService instance.
	 * Uses reflection to call the protected purgeStaleImportMeta method.
	 *
	 * @return WooCommerceImportService
	 */
	private function createImportService() {
		$app          = \Mockery::mock( \SureCart\Application::class );
		$import_state = new \SureCart\Sync\ImportState( 'woo' );

		return new WooCommerceImportService( $app, $import_state );
	}

	/**
	 * Helper: invoke the protected purgeStaleImportMeta method.
	 *
	 * @param WooCommerceImportService $service The service instance.
	 * @return void
	 */
	private function invokePurge( WooCommerceImportService $service ) {
		$ref = new \ReflectionMethod( $service, 'purgeStaleImportMeta' );
		$ref->setAccessible( true );
		$ref->invoke( $service );
	}

	/**
	 * Test that purgeStaleImportMeta clears meta when SC product post is missing.
	 */
	public function test_purge_clears_meta_when_sc_product_is_missing() {
		// Create a WC product marked as imported.
		$wc_product_id = $this->factory()->post->create( [ 'post_type' => 'product' ] );
		update_post_meta( $wc_product_id, '_surecart_imported', time() );

		// No matching sc_product post exists.
		$service = $this->createImportService();
		$this->invokePurge( $service );

		// Meta should be cleared.
		$this->assertEmpty( get_post_meta( $wc_product_id, '_surecart_imported', true ) );
	}

	/**
	 * Test that purgeStaleImportMeta preserves meta when SC product post exists (array format).
	 */
	public function test_purge_preserves_meta_when_sc_product_exists() {
		global $wpdb;

		// Create a WC product marked as imported.
		$wc_product_id = $this->factory()->post->create( [ 'post_type' => 'product' ] );
		update_post_meta( $wc_product_id, '_surecart_imported', time() );

		// Create a matching sc_product post with wc_product_id in its product meta (array format).
		$wpdb->insert(
			$wpdb->posts,
			[
				'post_type'   => 'sc_product',
				'post_status' => 'publish',
				'post_title'  => 'SC Product',
			]
		);
		$sc_post_id = (int) $wpdb->insert_id;
		update_post_meta(
			$sc_post_id,
			'product',
			[
				'id'       => 'prod_sc_123',
				'metadata' => [ 'wc_product_id' => $wc_product_id ],
			]
		);

		$service = $this->createImportService();
		$this->invokePurge( $service );

		// Meta should still be present.
		$this->assertNotEmpty( get_post_meta( $wc_product_id, '_surecart_imported', true ) );

		// Clean up.
		$wpdb->delete( $wpdb->posts, [ 'ID' => $sc_post_id ] );
		$wpdb->delete( $wpdb->postmeta, [ 'post_id' => $sc_post_id ] );
	}

	/**
	 * Test that purgeStaleImportMeta preserves meta when SC product meta is stored as object (stdClass).
	 */
	public function test_purge_preserves_meta_when_sc_product_meta_is_object() {
		global $wpdb;

		$wc_product_id = $this->factory()->post->create( [ 'post_type' => 'product' ] );
		update_post_meta( $wc_product_id, '_surecart_imported', time() );

		// Create sc_product with object-format meta (as stored by PostSyncService).
		$wpdb->insert(
			$wpdb->posts,
			[
				'post_type'   => 'sc_product',
				'post_status' => 'publish',
				'post_title'  => 'SC Product Object',
			]
		);
		$sc_post_id = (int) $wpdb->insert_id;
		update_post_meta(
			$sc_post_id,
			'product',
			(object) [
				'id'       => 'prod_sc_obj',
				'metadata' => (object) [ 'wc_product_id' => $wc_product_id ],
			]
		);

		$service = $this->createImportService();
		$this->invokePurge( $service );

		// Meta should still be present.
		$this->assertNotEmpty( get_post_meta( $wc_product_id, '_surecart_imported', true ) );

		$wpdb->delete( $wpdb->posts, [ 'ID' => $sc_post_id ] );
		$wpdb->delete( $wpdb->postmeta, [ 'post_id' => $sc_post_id ] );
	}

	/**
	 * Test that purgeStaleImportMeta no-ops when no imported products exist.
	 */
	public function test_purge_noops_when_no_imported_products() {
		// No WC products with _surecart_imported meta.
		$service = $this->createImportService();
		$this->invokePurge( $service );

		// Transient should still be set (proves it ran without error).
		$this->assertTrue( (bool) get_transient( 'sc_woo_import_purge_checked' ) );
	}

	/**
	 * Test that purgeStaleImportMeta invalidates the excluded IDs transient on cleanup.
	 */
	public function test_purge_invalidates_excluded_ids_transient() {
		// Create a stale WC product.
		$wc_product_id = $this->factory()->post->create( [ 'post_type' => 'product' ] );
		update_post_meta( $wc_product_id, '_surecart_imported', time() );
		set_transient( 'sc_woo_import_excluded_ids', [ $wc_product_id ], HOUR_IN_SECONDS );

		$service = $this->createImportService();
		$this->invokePurge( $service );

		// Excluded IDs transient should be cleared.
		$this->assertFalse( get_transient( 'sc_woo_import_excluded_ids' ) );
	}

	/**
	 * Test that purgeStaleImportMeta is throttled by transient.
	 */
	public function test_purge_is_throttled_by_transient() {
		// Create a stale WC product.
		$wc_product_id = $this->factory()->post->create( [ 'post_type' => 'product' ] );
		update_post_meta( $wc_product_id, '_surecart_imported', time() );

		// Set the throttle transient.
		set_transient( 'sc_woo_import_purge_checked', true, 6 * HOUR_IN_SECONDS );

		$service = $this->createImportService();
		$this->invokePurge( $service );

		// Meta should NOT be cleared (throttled).
		$this->assertNotEmpty( get_post_meta( $wc_product_id, '_surecart_imported', true ) );
	}
}
