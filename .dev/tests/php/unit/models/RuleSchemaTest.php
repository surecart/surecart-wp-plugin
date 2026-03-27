<?php

namespace SureCart\Tests\Unit\Models;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Models\RuleSchema;

class RuleSchemaTest extends SureCartUnitTestCase {
	
	/**
	 * Test that the model has correct endpoint and object name.
	 *
	 * @group rule_schema
	 * @group model
	 */
	public function test_model_properties() {
		$rule_schema = new RuleSchema();
		
		$this->assertEquals('auto_fees/rule_schema', $rule_schema->endpoint);
		$this->assertEquals('rule_schema', $rule_schema->object_name);
	}

	/**
	 * Test getRuleSchemaAttribute with empty attributes.
	 *
	 * @group rule_schema
	 * @group attributes
	 */
	public function test_get_rule_schema_attribute_with_empty_attributes() {
		$rule_schema = new RuleSchema();
		
		// Test with completely empty attributes using fill method
		$rule_schema->fill([]);
		$result = $this->callProtectedMethod($rule_schema, 'getRuleSchemaAttribute');
		$this->assertEquals([], $result);
		
		// Test with attributes but no 'attributes' key
		$rule_schema->fill(['other_key' => 'value']);
		$result = $this->callProtectedMethod($rule_schema, 'getRuleSchemaAttribute');
		$this->assertEquals([], $result);
		
		// Test with attributes['attributes'] empty
		$rule_schema->fill(['attributes' => []]);
		$result = $this->callProtectedMethod($rule_schema, 'getRuleSchemaAttribute');
		$this->assertEquals([], $result);
	}

	/**
	 * Test getRuleSchemaAttribute adds wp_user_role attribute.
	 *
	 * @group rule_schema
	 * @group attributes
	 */
	public function test_get_rule_schema_attribute_adds_wp_user_role() {
		$rule_schema = new RuleSchema();
		
		// Set up realistic attributes without wp_user_role using fill method
		$rule_schema->fill([
			'attributes' => [
				(object) [
					'key' => 'customer.email',
					'metadata' => false,
					'type' => 'string',
					'operators' => ['is', 'is_not', 'contains']
				],
				(object) [
					'key' => 'purchase.total_amount',
					'metadata' => false,
					'type' => 'number',
					'operators' => ['is', 'is_not', 'greater_than', 'less_than']
				]
			]
		]);

		$result = $this->callProtectedMethod($rule_schema, 'getRuleSchemaAttribute');
		
		$this->assertIsArray($result);
		$this->assertCount(3, $result); // Original 2 + wp_user_role
		
		// Check wp_user_role was added correctly
		$wp_user_role = null;
		foreach ($result as $attribute) {
			if (is_object($attribute) && $attribute->key === 'wp_user_role') {
				$wp_user_role = $attribute;
				break;
			}
		}
		
		$this->assertNotNull($wp_user_role);
		$this->assertEquals('wp_user_role', $wp_user_role->key);
		$this->assertTrue($wp_user_role->metadata);
		$this->assertEquals('string', $wp_user_role->type);
		$this->assertEquals(['is', 'is_not'], $wp_user_role->operators);
	}

	/**
	 * Test getRuleSchemaAttribute removes metadata and checkout.metadata attributes.
	 *
	 * @group rule_schema
	 * @group attributes
	 */
	public function test_get_rule_schema_attribute_removes_metadata_attributes() {
		$rule_schema = new RuleSchema();
		
		// Set up attributes including metadata and checkout.metadata that should be removed
		$rule_schema->fill([
			'attributes' => [
				(object) [
					'key' => 'customer.email',
					'metadata' => false,
					'type' => 'string',
					'operators' => ['is', 'is_not']
				],
				(object) [
					'key' => 'metadata',
					'metadata' => true,
					'type' => 'string',
					'operators' => ['is', 'is_not']
				],
				(object) [
					'key' => 'purchase.amount',
					'metadata' => false,
					'type' => 'number',
					'operators' => ['greater_than']
				],
				(object) [
					'key' => 'checkout.metadata',
					'metadata' => true,
					'type' => 'object',
					'operators' => ['is']
				],
				(object) [
					'key' => 'customer.country',
					'metadata' => false,
					'type' => 'string',
					'operators' => ['is', 'is_not']
				]
			]
		]);

		$result = $this->callProtectedMethod($rule_schema, 'getRuleSchemaAttribute');
		
		$this->assertIsArray($result);
		// Should have 3 kept + 1 wp_user_role = 4 total (metadata and checkout.metadata removed)
		$this->assertCount(4, $result);
		
		// Verify metadata attributes are not present
		$keys = array_map(function($attr) { return is_object($attr) ? $attr->key : null; }, $result);
		$this->assertNotContains('metadata', $keys);
		$this->assertNotContains('checkout.metadata', $keys);
		
		// Verify other attributes are still present
		$this->assertContains('customer.email', $keys);
		$this->assertContains('purchase.amount', $keys);
		$this->assertContains('customer.country', $keys);
		$this->assertContains('wp_user_role', $keys);
	}

	/**
	 * Test that array_values() ensures consecutive keys for JavaScript.
	 *
	 * @group rule_schema
	 * @group array_keys
	 */
	public function test_get_rule_schema_attribute_maintains_consecutive_array_keys() {
		$rule_schema = new RuleSchema();
		
		// Set up attributes where filtering will create gaps in array keys
		$rule_schema->fill([
			'attributes' => [
				(object) ['key' => 'keep1', 'type' => 'string'],           // index 0 - keep
				(object) ['key' => 'metadata', 'type' => 'string'],        // index 1 - remove
				(object) ['key' => 'keep2', 'type' => 'number'],           // index 2 - keep
				(object) ['key' => 'checkout.metadata', 'type' => 'object'], // index 3 - remove
				(object) ['key' => 'keep3', 'type' => 'string'],           // index 4 - keep
			]
		]);

		$result = $this->callProtectedMethod($rule_schema, 'getRuleSchemaAttribute');
		
		$this->assertIsArray($result);
		
		// Verify we have consecutive numeric keys (0, 1, 2, 3)
		$keys = array_keys($result);
		$expectedKeys = [0, 1, 2, 3]; // 3 kept + 1 wp_user_role
		$this->assertEquals($expectedKeys, $keys);
		
		// Verify the correct attributes remain in correct order
		$this->assertEquals('keep1', $result[0]->key);
		$this->assertEquals('keep2', $result[1]->key);
		$this->assertEquals('keep3', $result[2]->key);
		$this->assertEquals('wp_user_role', $result[3]->key);
	}

	/**
	 * Test complex realistic rule schema scenario.
	 *
	 * @group rule_schema
	 * @group realistic
	 */
	public function test_realistic_rule_schema_scenario() {
		$rule_schema = new RuleSchema();
		
		// Simplified but realistic e-commerce rule schema attributes
		$rule_schema->fill([
			'attributes' => [
				(object) [
					'key' => 'customer.email',
					'label' => 'Customer Email',
					'metadata' => false,
					'type' => 'string',
					'operators' => ['is', 'is_not', 'contains']
				],
				(object) ['key' => 'metadata', 'type' => 'object'], // Should be removed
				(object) [
					'key' => 'purchase.total_amount',
					'label' => 'Purchase Total',
					'metadata' => false,
					'type' => 'number',
					'operators' => ['greater_than', 'less_than']
				],
				(object) ['key' => 'checkout.metadata', 'type' => 'object'] // Should be removed
			]
		]);

		$result = $this->callProtectedMethod($rule_schema, 'getRuleSchemaAttribute');
		
		$this->assertIsArray($result);
		// 4 original - 2 removed + 1 wp_user_role = 3
		$this->assertCount(3, $result);
		
		// Verify correct attributes remain with consecutive keys
		$keys = array_keys($result);
		$this->assertEquals([0, 1, 2], $keys);
		
		$attribute_keys = array_map(function($attr) { return $attr->key; }, $result);
		$expected_keys = ['customer.email', 'purchase.total_amount', 'wp_user_role'];
		$this->assertEquals($expected_keys, $attribute_keys);
		
		// Verify wp_user_role was added correctly
		$wp_user_role = $result[2];
		$this->assertEquals('wp_user_role', $wp_user_role->key);
		$this->assertTrue($wp_user_role->metadata);
		$this->assertEquals(['is', 'is_not'], $wp_user_role->operators);
	}

	/**
	 * Test getRuleSchemaAttribute when wp_user_role already exists.
	 *
	 * @group rule_schema
	 * @group edge_cases
	 */
	public function test_get_rule_schema_attribute_with_existing_wp_user_role() {
		$rule_schema = new RuleSchema();
		
		// Set up attributes that already include wp_user_role
		$rule_schema->fill([
			'attributes' => [
				(object) [
					'key' => 'customer.email',
					'type' => 'string',
					'operators' => ['is']
				],
				(object) [
					'key' => 'wp_user_role',
					'metadata' => true,
					'type' => 'string',
					'operators' => ['is', 'is_not'],
					'existing' => true // Mark to identify original
				]
			]
		]);

		$result = $this->callProtectedMethod($rule_schema, 'getRuleSchemaAttribute');
		
		$this->assertIsArray($result);
		// Should have 2 original + 1 added wp_user_role = 3 total
		$this->assertCount(3, $result);
		
		// Count wp_user_role attributes
		$wp_user_role_count = 0;
		foreach ($result as $attribute) {
			if ($attribute->key === 'wp_user_role') {
				$wp_user_role_count++;
			}
		}
		
		// Should have 2 wp_user_role attributes (original + added)
		$this->assertEquals(2, $wp_user_role_count);
	}

	/**
	 * Test that filtering preserves object properties correctly.
	 *
	 * @group rule_schema
	 * @group object_properties
	 */
	public function test_filtering_preserves_object_properties() {
		$rule_schema = new RuleSchema();
		
		$rule_schema->fill([
			'attributes' => [
				(object) [
					'key' => 'keep_this',
					'label' => 'Keep This Attribute',
					'metadata' => false,
					'type' => 'string',
					'operators' => ['is', 'is_not'],
					'required' => true,
					'validation' => ['min_length' => 3]
				],
				(object) [
					'key' => 'metadata', // Will be removed
					'label' => 'Remove This',
					'type' => 'object'
				]
			]
		]);

		$result = $this->callProtectedMethod($rule_schema, 'getRuleSchemaAttribute');
		
		$this->assertCount(2, $result); // 1 kept + 1 wp_user_role
		
		// Verify all properties of kept attribute are preserved
		$kept_attr = $result[0];
		$this->assertEquals('keep_this', $kept_attr->key);
		$this->assertEquals('Keep This Attribute', $kept_attr->label);
		$this->assertFalse($kept_attr->metadata);
		$this->assertEquals('string', $kept_attr->type);
		$this->assertEquals(['is', 'is_not'], $kept_attr->operators);
		$this->assertTrue($kept_attr->required);
		$this->assertEquals(['min_length' => 3], $kept_attr->validation);
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