<?php
/**
 * ImportState unit tests.
 *
 * @group import_state
 */

namespace SureCart\Tests\Sync;

use SureCart\Sync\ImportState;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Tests for ImportState.
 *
 * @group import_state
 */
class ImportStateTest extends SureCartUnitTestCase {

	/**
	 * The import state instance.
	 *
	 * @var ImportState
	 */
	private ImportState $state;

	/**
	 * Set up the test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->state = new ImportState( 'woo' );
		$this->state->reset();
	}

	/**
	 * Tear down.
	 */
	public function tearDown(): void {
		$this->state->reset();
		// Also clean up any transients created during tests.
		$session_id = get_option( 'sc_woo_import_session_id' );
		if ( $session_id ) {
			delete_transient( 'sc_woo_import_skipped_' . $session_id );
		}
		parent::tearDown();
	}

	/**
	 * Test reset deletes all 3 options but does NOT delete transients.
	 */
	public function test_reset_deletes_options_not_transients() {
		// Set up state.
		update_option( 'sc_woo_import_ids', [ 'id-1' ] );
		update_option( 'sc_woo_import_session_id', 'test-session' );
		update_option( 'sc_woo_import_all_skipped', 'test-session' );
		set_transient( 'sc_woo_import_skipped_test-session', [ 'item1' ], 7 * DAY_IN_SECONDS );

		$this->state->reset();

		$this->assertFalse( get_option( 'sc_woo_import_ids' ) );
		$this->assertFalse( get_option( 'sc_woo_import_session_id' ) );
		$this->assertFalse( get_option( 'sc_woo_import_all_skipped' ) );
		// Transient should still exist.
		$this->assertEquals( [ 'item1' ], get_transient( 'sc_woo_import_skipped_test-session' ) );

		// Clean up transient.
		delete_transient( 'sc_woo_import_skipped_test-session' );
	}

	/**
	 * Test getOrCreateSessionId creates UUID and returns same on second call.
	 */
	public function test_get_or_create_session_id_lazy_creation() {
		$session_id = $this->state->getOrCreateSessionId();

		$this->assertNotEmpty( $session_id );
		$this->assertMatchesRegularExpression(
			'/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/',
			$session_id
		);

		// Second call returns the same ID.
		$this->assertEquals( $session_id, $this->state->getOrCreateSessionId() );
	}

	/**
	 * Test getSessionId returns null when not set.
	 */
	public function test_get_session_id_returns_null_when_not_set() {
		$this->assertNull( $this->state->getSessionId() );
	}

	/**
	 * Test getSessionId returns value after creation.
	 */
	public function test_get_session_id_returns_value_after_creation() {
		$created = $this->state->getOrCreateSessionId();
		$this->assertEquals( $created, $this->state->getSessionId() );
	}

	/**
	 * Test appendResultId accumulates IDs.
	 */
	public function test_append_result_id_accumulates() {
		$this->assertEquals( [], $this->state->getResultIds() );

		$this->state->appendResultId( 'id-1' );
		$this->assertEquals( [ 'id-1' ], $this->state->getResultIds() );

		$this->state->appendResultId( 'id-2' );
		$this->assertEquals( [ 'id-1', 'id-2' ], $this->state->getResultIds() );
	}

	/**
	 * Test getResultIds returns empty array initially.
	 */
	public function test_get_result_ids_returns_empty_initially() {
		$this->assertEquals( [], $this->state->getResultIds() );
	}

	/**
	 * Test addSkippedItems creates session lazily and merges across calls.
	 */
	public function test_add_skipped_items_creates_session_and_merges() {
		$this->assertNull( $this->state->getSessionId() );

		$this->state->addSkippedItems( [ [ 'name' => 'Product A' ] ] );

		// Session should now exist.
		$session_id = $this->state->getSessionId();
		$this->assertNotNull( $session_id );

		// First batch stored.
		$this->assertCount( 1, $this->state->getSkippedItems() );

		// Second batch merges.
		$this->state->addSkippedItems( [ [ 'name' => 'Product B' ], [ 'name' => 'Product C' ] ] );
		$items = $this->state->getSkippedItems();
		$this->assertCount( 3, $items );
		$this->assertEquals( 'Product A', $items[0]['name'] );
		$this->assertEquals( 'Product B', $items[1]['name'] );
		$this->assertEquals( 'Product C', $items[2]['name'] );

		// Clean up transient.
		delete_transient( 'sc_woo_import_skipped_' . $session_id );
	}

	/**
	 * Test addSkippedItems returns early on empty array.
	 */
	public function test_add_skipped_items_noop_on_empty() {
		$this->state->addSkippedItems( [] );
		$this->assertNull( $this->state->getSessionId() );
	}

	/**
	 * Test getSkippedItems returns empty when no session exists.
	 */
	public function test_get_skipped_items_returns_empty_without_session() {
		$this->assertEquals( [], $this->state->getSkippedItems() );
	}

	/**
	 * Test getSkippedItemsBySession with arbitrary session ID.
	 */
	public function test_get_skipped_items_by_session() {
		$session_id = 'custom-session-123';
		set_transient( 'sc_woo_import_skipped_' . $session_id, [ [ 'name' => 'Test' ] ], 7 * DAY_IN_SECONDS );

		$items = $this->state->getSkippedItemsBySession( $session_id );
		$this->assertCount( 1, $items );
		$this->assertEquals( 'Test', $items[0]['name'] );

		// Non-existent session returns empty.
		$this->assertEquals( [], $this->state->getSkippedItemsBySession( 'nonexistent' ) );

		// Clean up.
		delete_transient( 'sc_woo_import_skipped_' . $session_id );
	}

	/**
	 * Test markAllSkipped, isAllSkipped, getAllSkippedSessionId.
	 */
	public function test_all_skipped_flag() {
		$this->assertFalse( $this->state->isAllSkipped() );
		$this->assertNull( $this->state->getAllSkippedSessionId() );

		$this->state->markAllSkipped();

		$this->assertTrue( $this->state->isAllSkipped() );
		$session_id = $this->state->getAllSkippedSessionId();
		$this->assertNotNull( $session_id );

		// The all-skipped session ID matches the created session.
		$this->assertEquals( $this->state->getSessionId(), $session_id );
	}

	/**
	 * Test full lifecycle: create session → append IDs → add skipped → reset → verify.
	 */
	public function test_full_lifecycle() {
		// Create session via skipped items.
		$this->state->addSkippedItems( [ [ 'name' => 'Skipped Product' ] ] );
		$session_id = $this->state->getSessionId();

		// Append result IDs.
		$this->state->appendResultId( 'import-1' );
		$this->state->appendResultId( 'import-2' );

		// Verify state.
		$this->assertEquals( [ 'import-1', 'import-2' ], $this->state->getResultIds() );
		$this->assertCount( 1, $this->state->getSkippedItems() );
		$this->assertNotNull( $session_id );

		// Reset.
		$this->state->reset();

		// Options should be gone.
		$this->assertEquals( [], $this->state->getResultIds() );
		$this->assertNull( $this->state->getSessionId() );
		$this->assertNull( $this->state->getAllSkippedSessionId() );

		// Transient should still exist (7-day TTL, not cleaned by reset).
		$transient = get_transient( 'sc_woo_import_skipped_' . $session_id );
		$this->assertIsArray( $transient );
		$this->assertCount( 1, $transient );

		// Clean up transient.
		delete_transient( 'sc_woo_import_skipped_' . $session_id );
	}

	/**
	 * Test different $type values produce isolated key spaces.
	 */
	public function test_type_isolation() {
		$woo_state    = new ImportState( 'woo' );
		$shopify_state = new ImportState( 'shopify' );

		$woo_state->appendResultId( 'woo-id-1' );
		$shopify_state->appendResultId( 'shopify-id-1' );

		$this->assertEquals( [ 'woo-id-1' ], $woo_state->getResultIds() );
		$this->assertEquals( [ 'shopify-id-1' ], $shopify_state->getResultIds() );

		$woo_state->reset();
		$this->assertEquals( [], $woo_state->getResultIds() );
		$this->assertEquals( [ 'shopify-id-1' ], $shopify_state->getResultIds() );

		$shopify_state->reset();
	}
}
