<?php

namespace SureCart\Tests\Unit\Models;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Models\AutoFee;

class AutoFeeTest extends SureCartUnitTestCase {
	
	/**
	 * Test that the model has correct endpoint and object name.
	 *
	 * @group auto_fee
	 * @group model
	 */
	public function test_model_properties() {
		$auto_fee = new AutoFee();
		
		$this->assertEquals('auto_fees', $this->getProtectedProperty($auto_fee, 'endpoint'));
		$this->assertEquals('auto_fee', $this->getProtectedProperty($auto_fee, 'object_name'));
	}

	/**
	 * Test setRulesAttribute with empty value.
	 *
	 * @group auto_fee
	 * @group rules
	 */
	public function test_set_rules_attribute_with_empty_value() {
		$auto_fee = new AutoFee();
		
		$auto_fee->setRulesAttribute(null);
		$this->assertEquals([], $auto_fee->rules);
		
		$auto_fee->setRulesAttribute('');
		$this->assertEquals([], $auto_fee->rules);
		
		$auto_fee->setRulesAttribute([]);
		$this->assertEquals([], $auto_fee->rules);
	}

	/**
	 * Test handleCustomAttributes with wp_user_role transformation.
	 *
	 * @group auto_fee
	 * @group rules
	 */
	public function test_handle_custom_attributes_wp_user_role_transformation() {
		$auto_fee = new AutoFee();
		
		$rule_json = [
			[
				'attribute_name' => 'wp_user_role',
				'operator' => 'is',
				'value' => 'subscriber'
			]
		];

		$result = $auto_fee->handleCustomAttributes($rule_json);
		
		$this->assertIsArray($result);
		$this->assertCount(1, $result);
		$this->assertEquals('metadata', $result[0]['attribute_name']);
		$this->assertEquals('wp_user_role', $result[0]['metadata_key']);
		$this->assertEquals('is', $result[0]['operator']);
		$this->assertEquals('subscriber', $result[0]['value']);
	}

	/**
	 * Test handleCustomAttributes with reverse metadata transformation.
	 *
	 * @group auto_fee
	 * @group rules
	 */
	public function test_handle_custom_attributes_metadata_to_wp_user_role() {
		$auto_fee = new AutoFee();
		
		$rule_json = [
			[
				'attribute_name' => 'metadata',
				'metadata_key' => 'wp_user_role',
				'operator' => 'is_not',
				'value' => 'administrator'
			]
		];

		$result = $auto_fee->handleCustomAttributes($rule_json);
		
		$this->assertIsArray($result);
		$this->assertCount(1, $result);
		$this->assertEquals('wp_user_role', $result[0]['attribute_name']);
		$this->assertEquals('wp_user_role', $result[0]['metadata_key']); // metadata_key is preserved
		$this->assertEquals('is_not', $result[0]['operator']);
		$this->assertEquals('administrator', $result[0]['value']);
	}

	/**
	 * Test handleCustomAttributes with nested arrays.
	 *
	 * @group auto_fee
	 * @group rules
	 */
	public function test_handle_custom_attributes_with_nested_arrays() {
		$auto_fee = new AutoFee();
		
		$rule_json = [
			'conditions' => [
				[
					'attribute_name' => 'wp_user_role',
					'operator' => 'is',
					'value' => 'subscriber'
				],
				[
					'attribute_name' => 'metadata',
					'metadata_key' => 'wp_user_role',
					'operator' => 'is_not',
					'value' => 'admin'
				]
			]
		];

		$result = $auto_fee->handleCustomAttributes($rule_json);
		
		$this->assertIsArray($result);
		$this->assertArrayHasKey('conditions', $result);
		$this->assertCount(2, $result['conditions']);
		
		// First condition: wp_user_role -> metadata
		$this->assertEquals('metadata', $result['conditions'][0]['attribute_name']);
		$this->assertEquals('wp_user_role', $result['conditions'][0]['metadata_key']);
		
		// Second condition: metadata -> wp_user_role
		$this->assertEquals('wp_user_role', $result['conditions'][1]['attribute_name']);
	}

	/**
	 * Test handleCustomAttributes skips items without attribute_name.
	 *
	 * @group auto_fee
	 * @group rules
	 */
	public function test_handle_custom_attributes_skips_items_without_attribute_name() {
		$auto_fee = new AutoFee();
		
		$rule_json = [
			[
				'operator' => 'is',
				'value' => 'subscriber'
			],
			[
				'attribute_name' => 'wp_user_role',
				'operator' => 'is',
				'value' => 'admin'
			]
		];

		$result = $auto_fee->handleCustomAttributes($rule_json);
		
		$this->assertIsArray($result);
		$this->assertCount(2, $result);
		
		// First item should remain unchanged (no attribute_name)
		$this->assertArrayNotHasKey('attribute_name', $result[0]);
		$this->assertEquals('is', $result[0]['operator']);
		
		// Second item should be transformed
		$this->assertEquals('metadata', $result[1]['attribute_name']);
		$this->assertEquals('wp_user_role', $result[1]['metadata_key']);
	}

	/**
	 * Test handleCustomAttributes skips metadata items without metadata_key.
	 *
	 * @group auto_fee
	 * @group rules
	 */
	public function test_handle_custom_attributes_skips_metadata_without_key() {
		$auto_fee = new AutoFee();
		
		$rule_json = [
			[
				'attribute_name' => 'metadata',
				'operator' => 'is',
				'value' => 'test'
			]
		];

		$result = $auto_fee->handleCustomAttributes($rule_json);
		
		$this->assertIsArray($result);
		$this->assertCount(1, $result);
		
		// Should remain unchanged since no metadata_key
		$this->assertEquals('metadata', $result[0]['attribute_name']);
		$this->assertArrayNotHasKey('metadata_key', $result[0]);
	}

	/**
	 * Test convertObjectToArray with objects.
	 *
	 * @group auto_fee
	 * @group conversion
	 */
	public function test_convert_object_to_array_with_object() {
		$auto_fee = new AutoFee();
		
		$object = (object) [
			'key1' => 'value1',
			'key2' => (object) ['nested' => 'value']
		];

		$result = $this->callProtectedMethod($auto_fee, 'convertObjectToArray', [$object]);
		
		$this->assertIsArray($result);
		$this->assertEquals('value1', $result['key1']);
		$this->assertIsArray($result['key2']);
		$this->assertEquals('value', $result['key2']['nested']);
	}

	/**
	 * Test convertObjectToArray with array.
	 *
	 * @group auto_fee
	 * @group conversion
	 */
	public function test_convert_object_to_array_with_array() {
		$auto_fee = new AutoFee();
		
		$array = [
			'key1' => 'value1',
			'key2' => (object) ['nested' => 'value']
		];

		$result = $this->callProtectedMethod($auto_fee, 'convertObjectToArray', [$array]);
		
		$this->assertIsArray($result);
		$this->assertEquals('value1', $result['key1']);
		$this->assertIsArray($result['key2']);
		$this->assertEquals('value', $result['key2']['nested']);
	}

	/**
	 * Test convertObjectToArray with scalar value.
	 *
	 * @group auto_fee
	 * @group conversion
	 */
	public function test_convert_object_to_array_with_scalar() {
		$auto_fee = new AutoFee();
		
		$result = $this->callProtectedMethod($auto_fee, 'convertObjectToArray', ['scalar_value']);
		$this->assertEquals('scalar_value', $result);
		
		$result = $this->callProtectedMethod($auto_fee, 'convertObjectToArray', [123]);
		$this->assertEquals(123, $result);
		
		$result = $this->callProtectedMethod($auto_fee, 'convertObjectToArray', [true]);
		$this->assertEquals(true, $result);
	}

	/**
	 * Test setRulesAttribute preserves object type when input is object.
	 *
	 * @group auto_fee
	 * @group rules
	 */
	public function test_set_rules_attribute_preserves_object_type() {
		$auto_fee = new AutoFee();
		
		// Test with an array containing the object (which is how rules are usually structured)
		$rule_object = (object) [
			[
				'attribute_name' => 'metadata',
				'metadata_key' => 'wp_user_role',
				'operator' => 'is',
				'value' => 'subscriber'
			]
		];

		$auto_fee->setRulesAttribute($rule_object);
		$result = $auto_fee->rules;
		
		$this->assertIsObject($result);
		$this->assertIsArray($result->{0}); // First item should be array
		$this->assertEquals('wp_user_role', $result->{0}['attribute_name']);
	}

	/**
	 * Test complex nested rule transformation.
	 *
	 * @group auto_fee
	 * @group rules
	 */
	public function test_complex_nested_rule_transformation() {
		$auto_fee = new AutoFee();
		
		$complex_rules = [
			'conditions' => [
				'group1' => [
					[
						'attribute_name' => 'wp_user_role',
						'operator' => 'is',
						'value' => 'subscriber'
					]
				],
				'group2' => [
					[
						'attribute_name' => 'metadata',
						'metadata_key' => 'wp_user_role',
						'operator' => 'is_not',
						'value' => 'admin'
					]
				]
			]
		];

		$result = $auto_fee->handleCustomAttributes($complex_rules);
		
		$this->assertIsArray($result);
		$this->assertArrayHasKey('conditions', $result);
		
		// Check group1 transformation
		$group1 = $result['conditions']['group1'][0];
		$this->assertEquals('metadata', $group1['attribute_name']);
		$this->assertEquals('wp_user_role', $group1['metadata_key']);
		
		// Check group2 transformation
		$group2 = $result['conditions']['group2'][0];
		$this->assertEquals('wp_user_role', $group2['attribute_name']);
		$this->assertEquals('wp_user_role', $group2['metadata_key']); // metadata_key is preserved
	}

	/**
	 * Helper method to access protected properties.
	 *
	 * @param object $object The object instance.
	 * @param string $property The property name.
	 * @return mixed The property value.
	 */
	private function getProtectedProperty($object, $property) {
		$reflection = new \ReflectionClass($object);
		$property = $reflection->getProperty($property);
		$property->setAccessible(true);
		return $property->getValue($object);
	}

	/**
	 * Helper method to call protected methods.
	 *
	 * @param object $object The object instance.
	 * @param string $method The method name.
	 * @param array $args The method arguments.
	 * @return mixed The method result.
	 */
	private function callProtectedMethod($object, $method, $args = []) {
		$reflection = new \ReflectionClass($object);
		$method = $reflection->getMethod($method);
		$method->setAccessible(true);
		return $method->invokeArgs($object, $args);
	}
}