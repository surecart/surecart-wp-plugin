<?php

namespace SureCart\Tests\Sync;

use SureCart\Sync\BatchCheckService;
use SureCart\Tests\SureCartUnitTestCase;

class BatchCheckServiceTest extends SureCartUnitTestCase {
	/**
	 * The service instance.
	 *
	 * @var BatchCheckService
	 */
	protected $service;

	/**
	 * Set up the test case.
	 */
	public function setUp(): void {
		parent::setUp();
		// Clean up any existing transient before each test
		delete_transient( 'surecart_batches_check' );
		$this->service = new BatchCheckService();
	}

	/**
	 * Tear down the test case.
	 */
	public function tearDown(): void {
		// Clean up transient after each test
		delete_transient( 'surecart_batches_check' );
		parent::tearDown();
	}

	/**
	 * Test getting all items when transient is empty.
	 */
	public function test_get_returns_empty_array_when_no_transient() {
		delete_transient( 'surecart_batches_check' );

		$raw_transient = get_transient( 'surecart_batches_check' );
		$this->assertFalse( $raw_transient );

		$result = $this->service->get();
		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test getting a specific item by ID when transient is empty.
	 */
	public function test_get_with_id_returns_false_when_no_transient() {
		$result = $this->service->get( 'non-existent-id' );
		$this->assertFalse( $result );
	}

	/**
	 * Test getting all items.
	 */
	public function test_get_returns_all_items() {
		$items = [
			'batch1' => 'value1',
			'batch2' => 'value2',
			'batch3' => 'value3',
		];
		set_transient( 'surecart_batches_check', $items );

		$result = $this->service->get();
		$this->assertEquals( $items, $result );
	}

	/**
	 * Test getting a specific item by ID.
	 */
	public function test_get_with_id_returns_specific_item() {
		$items = [
			'batch1' => 'value1',
			'batch2' => 'value2',
			'batch3' => 'value3',
		];
		set_transient( 'surecart_batches_check', $items );

		$result = $this->service->get( 'batch2' );
		$this->assertEquals( 'value2', $result );
	}

	/**
	 * Test getting a non-existent item by ID.
	 */
	public function test_get_with_id_returns_false_for_non_existent() {
		$items = [
			'batch1' => 'value1',
			'batch2' => 'value2',
		];
		set_transient( 'surecart_batches_check', $items );

		$result = $this->service->get( 'batch3' );
		$this->assertFalse( $result );
	}

	/**
	 * Test setting an item when transient is empty.
	 */
	public function test_set_creates_new_transient() {
		$result = $this->service->set( 'batch1', 'value1' );
		$this->assertTrue( $result );

		$stored = get_transient( 'surecart_batches_check' );
		$this->assertEquals( [ 'batch1' => 'value1' ], $stored );
	}

	/**
	 * Test setting an item when transient already has items.
	 */
	public function test_set_adds_to_existing_transient() {
		set_transient( 'surecart_batches_check', [ 'batch1' => 'value1' ] );

		$result = $this->service->set( 'batch2', 'value2' );
		$this->assertTrue( $result );

		$stored = get_transient( 'surecart_batches_check' );
		$this->assertEquals( [
			'batch1' => 'value1',
			'batch2' => 'value2',
		], $stored );
	}

	/**
	 * Test updating an existing item.
	 */
	public function test_set_updates_existing_item() {
		set_transient( 'surecart_batches_check', [
			'batch1' => 'old_value',
			'batch2' => 'value2',
		] );

		$result = $this->service->set( 'batch1', 'new_value' );
		$this->assertTrue( $result );

		$stored = get_transient( 'surecart_batches_check' );
		$this->assertEquals( [
			'batch1' => 'new_value',
			'batch2' => 'value2',
		], $stored );
	}

	/**
	 * Test that set filters out empty values.
	 */
	public function test_set_filters_empty_values() {
		set_transient( 'surecart_batches_check', [
			'batch1' => 'value1',
			'batch2' => '',
		] );

		$result = $this->service->set( 'batch3', 'value3' );
		$this->assertTrue( $result );

		$stored = get_transient( 'surecart_batches_check' );
		// Empty string should be filtered out
		$this->assertEquals( [
			'batch1' => 'value1',
			'batch3' => 'value3',
		], $stored );
	}

	/**
	 * Test that set handles null values.
	 */
	public function test_set_filters_null_values() {
		$result = $this->service->set( 'batch1', null );
		$this->assertTrue( $result );

		$stored = get_transient( 'surecart_batches_check' );
		// Null should be filtered out
		$this->assertEquals( [], $stored );
	}

	/**
	 * Test removing an item.
	 */
	public function test_remove_deletes_item() {
		set_transient( 'surecart_batches_check', [
			'batch1' => 'value1',
			'batch2' => 'value2',
			'batch3' => 'value3',
		] );

		$result = $this->service->remove( 'batch2' );
		$this->assertTrue( $result );

		$stored = get_transient( 'surecart_batches_check' );
		$this->assertEquals( [
			'batch1' => 'value1',
			'batch3' => 'value3',
		], $stored );
	}

	/**
	 * Test removing the last item deletes the transient.
	 */
	public function test_remove_last_item_deletes_transient() {
		set_transient( 'surecart_batches_check', [
			'batch1' => 'value1',
		] );

		$result = $this->service->remove( 'batch1' );
		$this->assertTrue( $result );

		$stored = get_transient( 'surecart_batches_check' );
		$this->assertFalse( $stored );
	}

	/**
	 * Test removing a non-existent item.
	 */
	public function test_remove_non_existent_item() {
		set_transient( 'surecart_batches_check', [
			'batch1' => 'value1',
		] );

		$result = $this->service->remove( 'non-existent' );
		$this->assertTrue( $result );

		// Transient should remain unchanged
		$stored = get_transient( 'surecart_batches_check' );
		$this->assertEquals( [ 'batch1' => 'value1' ], $stored );
	}

	/**
	 * Test removing from empty transient.
	 */
	public function test_remove_from_empty_transient() {
		$result = $this->service->remove( 'batch1' );
		$this->assertFalse( $result );

		// When removing from empty, transient should be deleted (returns false) or be empty array
		$stored = get_transient( 'surecart_batches_check' );
		$this->assertFalse( $stored );
	}

	/**
	 * Test that duplicate values are allowed with different IDs.
	 */
	public function test_allows_duplicate_values() {
		// Set multiple items with the same value but different IDs
		$this->service->set( 'batch1', 'duplicate_value' );
		$this->service->set( 'batch2', 'duplicate_value' );
		$this->service->set( 'batch3', 'unique_value' );

		$stored = get_transient( 'surecart_batches_check' );

		// All items should be preserved since they have different IDs
		$this->assertEquals( [
			'batch1' => 'duplicate_value',
			'batch2' => 'duplicate_value',
			'batch3' => 'unique_value',
		], $stored );
	}

	/**
	 * Test handling of scalar data types.
	 */
	public function test_handles_scalar_data_types() {
		// Test with various scalar types
		$this->service->set( 'string', 'test_string' );
		$this->service->set( 'integer', 42 );
		$this->service->set( 'float', 3.14 );
		$this->service->set( 'boolean', true );
		$this->service->set( 'array', [ 'test_array' ] );

		$this->assertEquals( 'test_string', $this->service->get( 'string' ) );
		$this->assertEquals( 42, $this->service->get( 'integer' ) );
		$this->assertEquals( 3.14, $this->service->get( 'float' ) );
		$this->assertEquals( true, $this->service->get( 'boolean' ) );
		$this->assertEquals( [ 'test_array' ], $this->service->get( 'array' ) );
	}

	/**
	 * Test handling of array values.
	 */
	public function test_handles_array_values() {
		// Arrays should now be supported
		$array_data = [
			'nested' => 'value',
			'items' => [ 1, 2, 3 ],
		];

		$result = $this->service->set( 'array_batch', $array_data );
		$this->assertTrue( $result );

		$retrieved = $this->service->get( 'array_batch' );
		$this->assertEquals( $array_data, $retrieved );
	}

	/**
	 * Test that transient expiration is set correctly.
	 */
	public function test_transient_expiration() {
		// Set an item
		$this->service->set( 'batch1', 'value1' );

		// Get the transient timeout
		$timeout = get_option( '_transient_timeout_surecart_batches_check' );

		// The timeout should be set and should be approximately 10 minutes from now
		$this->assertNotFalse( $timeout );

		// Check that the expiration is within a reasonable range (9-11 minutes from now)
		$expected_time = time() + ( 10 * MINUTE_IN_SECONDS );
		$this->assertGreaterThanOrEqual( $expected_time - 60, $timeout );
		$this->assertLessThanOrEqual( $expected_time + 60, $timeout );
	}

	/**
	 * Test concurrent operations.
	 */
	public function test_concurrent_operations() {
		// Simulate concurrent sets
		$this->service->set( 'batch1', 'value1' );
		$this->service->set( 'batch2', 'value2' );
		$this->service->set( 'batch3', 'value3' );

		// Remove one while others exist
		$this->service->remove( 'batch2' );

		// Add another
		$this->service->set( 'batch4', 'value4' );

		$result = $this->service->get();
		$this->assertEquals( [
			'batch1' => 'value1',
			'batch3' => 'value3',
			'batch4' => 'value4',
		], $result );
	}

	/**
	 * Test edge case with false as a value.
	 */
	public function test_handles_false_value() {
		$this->service->set( 'batch1', false );

		// False should be filtered out by array_filter
		$stored = get_transient( 'surecart_batches_check' );
		$this->assertEquals( [], $stored );
	}

	/**
	 * Test edge case with zero as a value.
	 */
	public function test_handles_zero_value() {
		$this->service->set( 'batch1', 0 );

		// Zero should be filtered out by array_filter
		$stored = get_transient( 'surecart_batches_check' );
		$this->assertEquals( [], $stored );
	}

	/**
	 * Test edge case with empty array as a value.
	 */
	public function test_handles_empty_array_value() {
		$this->service->set( 'batch1', [] );

		// Empty array should be filtered out by array_filter
		$stored = get_transient( 'surecart_batches_check' );
		$this->assertEquals( [], $stored );
	}

	/**
	 * Test handling of complex nested data structures.
	 */
	public function test_handles_complex_data_structures() {
		$complex_data = [
			'products' => [
				['id' => 1, 'name' => 'Product 1'],
				['id' => 2, 'name' => 'Product 2'],
			],
			'metadata' => [
				'created_at' => '2024-01-01',
				'updated_at' => '2024-01-02',
			],
			'flags' => ['active', 'featured'],
			'object' => (object) ['prop' => 'value'],
		];

		$result = $this->service->set( 'complex_batch', $complex_data );
		$this->assertTrue( $result );

		$retrieved = $this->service->get( 'complex_batch' );
		$this->assertEquals( $complex_data, $retrieved );

		// Test multiple complex items
		$this->service->set( 'another_complex', ['data' => ['nested' => true]] );

		$all_items = $this->service->get();
		$this->assertArrayHasKey( 'complex_batch', $all_items );
		$this->assertArrayHasKey( 'another_complex', $all_items );
	}
}