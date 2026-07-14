<?php

namespace SureCart\Tests\Models\Model;

use SureCart\Models\Model;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * A minimal test model with a simple accessor for mutator resolution tests.
 */
class MutatorTestModel extends Model {
	protected $endpoint    = 'mutator_test_models';
	protected $object_name = 'mutator_test_model';

	public function getDisplayNameAttribute( $value = null ) {
		return strtoupper( $this->attributes['name'] ?? '' );
	}
}

class ModelGetMutatorTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		\SureCart::make()->bootstrap( [ 'providers' => [] ], false );
		parent::setUp();
	}

	/**
	 * Empty keys must not resolve — `getMutator('')` would otherwise resolve
	 * to the method name `getAttribute` itself and recurse forever.
	 *
	 * @group model-mutator
	 */
	public function test_empty_or_non_string_keys_resolve_no_mutator() {
		$model = new MutatorTestModel( [ 'id' => 'test_1' ] );

		$this->assertFalse( $model->getMutator( '', 'get' ) );
		$this->assertFalse( $model->getMutator( null, 'get' ) );
		$this->assertFalse( $model->getMutator( '', 'set' ) );
		$this->assertFalse( $model->getMutator( 0, 'get' ) );
	}

	/**
	 * getAttribute with an empty key returns null instead of recursing.
	 *
	 * @group model-mutator
	 */
	public function test_get_attribute_with_empty_key_returns_null() {
		$model = new MutatorTestModel( [ 'id' => 'test_1', 'name' => 'hello' ] );

		$this->assertNull( $model->getAttribute( '' ) );
		$this->assertNull( $model->getAttribute( null ) );
	}

	/**
	 * Normal accessor resolution still works with the guard in place.
	 *
	 * @group model-mutator
	 */
	public function test_normal_keys_still_resolve() {
		$model = new MutatorTestModel( [ 'id' => 'test_1', 'name' => 'hello' ] );

		$this->assertSame( 'getDisplayNameAttribute', $model->getMutator( 'display_name', 'get' ) );
		$this->assertSame( 'HELLO', $model->getAttribute( 'display_name' ) );

		$array = $model->toArray();
		$this->assertSame( 'HELLO', $array['display_name'] );
	}
}
