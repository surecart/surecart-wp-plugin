<?php

namespace SureCart\Tests\Models\Model;

use SureCart\Models\Model;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * A minimal test model with a simple accessor for testing filter behavior.
 */
class TestModel extends Model {
	protected $endpoint    = 'test_models';
	protected $object_name = 'test_model';

	public function getDisplayNameAttribute( $value = null ) {
		return strtoupper( $this->attributes['name'] ?? '' );
	}
}

class ModelGetAttributeFilterTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		\SureCart::make()->bootstrap( [ 'providers' => [] ], false );
		parent::setUp();
	}

	/**
	 * Clean up filters after each test.
	 */
	public function tearDown(): void {
		remove_all_filters( 'surecart/test_model/get_attribute' );
		parent::tearDown();
	}

	/**
	 * @group model-filter
	 */
	public function test_toArray_fires_get_attribute_filter_for_accessors() {
		$filter_keys = [];

		add_filter(
			'surecart/test_model/get_attribute',
			function ( $attribute, $key, $model ) use ( &$filter_keys ) {
				$filter_keys[] = $key;
				return $attribute;
			},
			10,
			3
		);

		$model = new TestModel( [ 'id' => 'test_123', 'name' => 'hello' ] );
		$model->toArray();

		$this->assertNotEmpty( $filter_keys, 'Filter should have been called during toArray()' );
		$this->assertContains( 'display_name', $filter_keys );
	}

	/**
	 * @group model-filter
	 */
	public function test_toObject_fires_get_attribute_filter_for_accessors() {
		$filter_keys = [];

		add_filter(
			'surecart/test_model/get_attribute',
			function ( $attribute, $key, $model ) use ( &$filter_keys ) {
				$filter_keys[] = $key;
				return $attribute;
			},
			10,
			3
		);

		$model = new TestModel( [ 'id' => 'test_123', 'name' => 'hello' ] );
		$model->toObject();

		$this->assertNotEmpty( $filter_keys, 'Filter should have been called during toObject()' );
		$this->assertContains( 'display_name', $filter_keys );
	}

	/**
	 * @group model-filter
	 */
	public function test_get_attribute_filter_can_modify_value_in_toArray() {
		add_filter(
			'surecart/test_model/get_attribute',
			function ( $attribute, $key, $model ) {
				if ( 'display_name' === $key ) {
					return 'FILTERED VALUE';
				}
				return $attribute;
			},
			10,
			3
		);

		$model = new TestModel( [ 'id' => 'test_123', 'name' => 'hello' ] );
		$array = $model->toArray();

		$this->assertSame( 'FILTERED VALUE', $array['display_name'] );
	}

	/**
	 * @group model-filter
	 */
	public function test_get_attribute_filter_does_not_recurse_infinitely() {
		$nested_filter_calls = 0;

		add_filter(
			'surecart/test_model/get_attribute',
			function ( $attribute, $key, $model ) use ( &$nested_filter_calls ) {
				$nested_filter_calls++;
				// Accessing another attribute inside the filter via getAttribute should not
				// cause infinite recursion because the is_filtering_attribute guard skips re-entry.
				$id = $model->getAttribute( 'id' );
				return $attribute;
			},
			10,
			3
		);

		$model = new TestModel( [ 'id' => 'test_123', 'name' => 'Test' ] );
		$array = $model->toArray();

		// If we got here without a fatal error, recursion guard works.
		$this->assertIsArray( $array );
		$this->assertSame( 'test_123', $array['id'] );
		// The filter should fire a limited number of times (once per accessor), not infinitely.
		$this->assertLessThan( 20, $nested_filter_calls );
	}

	/**
	 * @group model-filter
	 */
	public function test_plain_attributes_without_accessor_serialize_correctly() {
		$model = new TestModel(
			[
				'id'          => 'test_123',
				'name'        => 'My Model',
				'description' => 'Some text',
			]
		);
		$array = $model->toArray();

		$this->assertSame( 'test_123', $array['id'] );
		$this->assertSame( 'My Model', $array['name'] );
		$this->assertSame( 'Some text', $array['description'] );
	}
}
