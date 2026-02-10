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

		// Realistic nested rule structure
		$rule_json = [
			"type" => "group",
			"combinator" => "and",
			"conditions" => [
				[
					"type" => "condition",
					"attribute_name" => "wp_user_role",
					"operator" => "is",
					"comparison_value" => "subscriber",
					"operator_label" => "is"
				],
				[
					"type" => "condition",
					"attribute_name" => "customer.email",
					"operator" => "contains",
					"comparison_value" => "@example.com"
				]
			]
		];

		$result = $auto_fee->handleCustomAttributes($rule_json, 'set');

		$this->assertIsArray($result);
		$this->assertEquals('group', $result['type']);
		$this->assertArrayHasKey('conditions', $result);
		$this->assertCount(2, $result['conditions']);

		// Check wp_user_role transformation
		$wp_user_condition = $result['conditions'][0];
		$this->assertEquals('condition', $wp_user_condition['type']);
		$this->assertEquals('checkout.metadata', $wp_user_condition['attribute_name']);
		$this->assertEquals('wp_user_role', $wp_user_condition['metadata_key']);
		$this->assertEquals('is', $wp_user_condition['operator']);
		$this->assertEquals('subscriber', $wp_user_condition['comparison_value']);

		// Check other condition remains unchanged
		$email_condition = $result['conditions'][1];
		$this->assertEquals('customer.email', $email_condition['attribute_name']);
		$this->assertEquals('contains', $email_condition['operator']);
	}

	/**
	 * Test handleCustomAttributes with reverse metadata transformation.
	 *
	 * @group auto_fee
	 * @group rules
	 */
	public function test_handle_custom_attributes_metadata_to_wp_user_role() {
		$auto_fee = new AutoFee();

		// Realistic rule structure with metadata transformation
		$rule_json = [
			"type" => "group",
			"combinator" => "or",
			"conditions" => [
				[
					"type" => "condition",
					"attribute_name" => "checkout.metadata",
					"metadata_key" => "wp_user_role",
					"operator" => "is_not",
					"comparison_value" => "administrator",
					"operator_label" => "is not"
				],
				[
					"type" => "condition",
					"attribute_name" => "purchase.total_amount",
					"operator" => "greater_than",
					"comparison_value" => 100
				]
			]
		];

		$result = $auto_fee->handleCustomAttributes($rule_json, 'get');

		$this->assertIsArray($result);
		$this->assertEquals('group', $result['type']);
		$this->assertEquals('or', $result['combinator']);
		$this->assertCount(2, $result['conditions']);

		// Check metadata -> wp_user_role transformation
		$user_role_condition = $result['conditions'][0];
		$this->assertEquals('condition', $user_role_condition['type']);
		$this->assertEquals('wp_user_role', $user_role_condition['attribute_name']);
		$this->assertEquals('wp_user_role', $user_role_condition['metadata_key']); // metadata_key is preserved
		$this->assertEquals('is_not', $user_role_condition['operator']);
		$this->assertEquals('administrator', $user_role_condition['comparison_value']);

		// Check other condition remains unchanged
		$amount_condition = $result['conditions'][1];
		$this->assertEquals('purchase.total_amount', $amount_condition['attribute_name']);
		$this->assertEquals('greater_than', $amount_condition['operator']);
	}

	/**
	 * Test handleCustomAttributes with nested arrays.
	 *
	 * @group auto_fee
	 * @group rules
	 */
	public function test_handle_custom_attributes_with_nested_arrays() {
		$auto_fee = new AutoFee();

		// Complex multi-level nested structure
		$rule_json = [
			"type" => "group",
			"combinator" => "and",
			"conditions" => [
				[
					"type" => "group",
					"combinator" => "or",
					"conditions" => [
						[
							"type" => "condition",
							"attribute_name" => "wp_user_role",
							"operator" => "is",
							"comparison_value" => "subscriber",
							"operator_label" => "is"
						],
						[
							"type" => "condition",
							"attribute_name" => "checkout.metadata",
							"metadata_key" => "wp_user_role",
							"operator" => "is_not",
							"comparison_value" => "admin",
							"operator_label" => "is not"
						]
						]
				],
				[
					"type" => "condition",
					"attribute_name" => "customer.country",
					"operator" => "is",
					"comparison_value" => "US"
				]
			]
		];

		$result = $auto_fee->handleCustomAttributes($rule_json, 'set');

		$this->assertIsArray($result);
		$this->assertEquals('group', $result['type']);
		$this->assertArrayHasKey('conditions', $result);
		$this->assertCount(2, $result['conditions']);

		// Check nested group transformations
		$nested_group = $result['conditions'][0];
		$this->assertEquals('group', $nested_group['type']);
		$this->assertEquals('or', $nested_group['combinator']);
		$this->assertCount(2, $nested_group['conditions']);

		// First condition: wp_user_role -> metadata
		$first_condition = $nested_group['conditions'][0];
		$this->assertEquals('checkout.metadata', $first_condition['attribute_name']);
		$this->assertEquals('wp_user_role', $first_condition['metadata_key']);

		// Second condition: metadata stays as metadata on 'set'
		$second_condition = $nested_group['conditions'][1];
		$this->assertEquals('checkout.metadata', $second_condition['attribute_name']);
		$this->assertEquals('wp_user_role', $second_condition['metadata_key']);

		// Check top-level condition remains unchanged
		$country_condition = $result['conditions'][1];
		$this->assertEquals('customer.country', $country_condition['attribute_name']);
		$this->assertEquals('is', $country_condition['operator']);
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

		$result = $auto_fee->handleCustomAttributes($rule_json, 'set');

		$this->assertIsArray($result);
		$this->assertCount(2, $result);

		// First item should remain unchanged (no attribute_name)
		$this->assertArrayNotHasKey('attribute_name', $result[0]);
		$this->assertEquals('is', $result[0]['operator']);

		// Second item should be transformed
		$this->assertEquals('checkout.metadata', $result[1]['attribute_name']);
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
				'attribute_name' => 'checkout.metadata',
				'operator' => 'is',
				'value' => 'test'
			]
		];

		$result = $auto_fee->handleCustomAttributes($rule_json, 'set');

		$this->assertIsArray($result);
		$this->assertCount(1, $result);

		// Should remain unchanged since no metadata_key
		$this->assertEquals('checkout.metadata', $result[0]['attribute_name']);
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

		// Test with a complex nested rule structure
		$rule_object = (object) [
			"type" => "group",
			"combinator" => "or",
			"conditions" => [
				(object) [
					"type" => "group",
					"combinator" => "and",
					"conditions" => [
						(object) [
							"type" => "condition",
							"attribute_name" => "wp_user_role",
							"operator_label" => "is",
							"comparison_value" => "administrator"
						]
					]
				]
			]
		];

		$auto_fee->setRulesAttribute($rule_object);
		$result = $auto_fee->rules;

		// Verify the object structure is preserved
		$this->assertIsObject($result);
		$this->assertEquals('group', $result->type);
		$this->assertEquals('or', $result->combinator);
		$this->assertIsArray($result->conditions);

		// Check nested group structure
		$first_condition_group = $result->conditions[0];
		$this->assertIsArray($first_condition_group); // Nested objects get converted to arrays
		$this->assertEquals('group', $first_condition_group['type']);
		$this->assertEquals('and', $first_condition_group['combinator']);

		// Check the wp_user_role transformation occurred (get transforms it back to wp_user_role)
		$condition = $first_condition_group['conditions'][0];
		$this->assertIsArray($condition); // Transformed to array by handleCustomAttributes
		$this->assertEquals('condition', $condition['type']);
		$this->assertEquals('wp_user_role', $condition['attribute_name']); // Transformed back on get
		$this->assertEquals('is', $condition['operator_label']);
		$this->assertEquals('administrator', $condition['comparison_value']);
	}

	/**
	 * Test complex nested rule transformation.
	 *
	 * @group auto_fee
	 * @group rules
	 */
	public function test_complex_nested_rule_transformation() {
		$auto_fee = new AutoFee();

		// Real-world complex rule structure with multiple nesting levels
		$complex_rules = [
			"type" => "group",
			"combinator" => "and",
			"conditions" => [
				[
					"type" => "group",
					"combinator" => "or",
					"name" => "user_restrictions",
					"conditions" => [
						[
							"type" => "condition",
							"attribute_name" => "wp_user_role",
							"operator" => "is",
							"comparison_value" => "subscriber",
							"operator_label" => "is"
						],
						[
							"type" => "condition",
							"attribute_name" => "customer.email",
							"operator" => "ends_with",
							"comparison_value" => "@premium.com"
						]
						]
				],
				[
					"type" => "group",
					"combinator" => "and",
					"name" => "metadata_restrictions",
					"conditions" => [
						[
							"type" => "condition",
							"attribute_name" => "checkout.metadata",
							"metadata_key" => "wp_user_role",
							"operator" => "is_not",
							"comparison_value" => "admin",
							"operator_label" => "is not"
						],
						[
							"type" => "condition",
							"attribute_name" => "purchase.total_amount",
							"operator" => "greater_than",
							"comparison_value" => 50
						]
						]
				]
			]
		];

		$result = $auto_fee->handleCustomAttributes($complex_rules, 'set');

		$this->assertIsArray($result);
		$this->assertEquals('group', $result['type']);
		$this->assertEquals('and', $result['combinator']);
		$this->assertArrayHasKey('conditions', $result);
		$this->assertCount(2, $result['conditions']);

		// Check first group (user_restrictions) transformation
		$user_group = $result['conditions'][0];
		$this->assertEquals('group', $user_group['type']);
		$this->assertEquals('user_restrictions', $user_group['name']);
		$this->assertCount(2, $user_group['conditions']);

		// First condition: wp_user_role -> metadata
		$wp_role_condition = $user_group['conditions'][0];
		$this->assertEquals('checkout.metadata', $wp_role_condition['attribute_name']);
		$this->assertEquals('wp_user_role', $wp_role_condition['metadata_key']);
		$this->assertEquals('subscriber', $wp_role_condition['comparison_value']);

		// Second condition: email (unchanged)
		$email_condition = $user_group['conditions'][1];
		$this->assertEquals('customer.email', $email_condition['attribute_name']);
		$this->assertEquals('ends_with', $email_condition['operator']);

		// Check second group (metadata_restrictions) transformation
		$metadata_group = $result['conditions'][1];
		$this->assertEquals('group', $metadata_group['type']);
		$this->assertEquals('metadata_restrictions', $metadata_group['name']);
		$this->assertCount(2, $metadata_group['conditions']);

		// First condition: metadata stays as metadata on 'set'
		$metadata_condition = $metadata_group['conditions'][0];
		$this->assertEquals('checkout.metadata', $metadata_condition['attribute_name']);
		$this->assertEquals('wp_user_role', $metadata_condition['metadata_key']);
		$this->assertEquals('admin', $metadata_condition['comparison_value']);

		// Second condition: purchase amount (unchanged)
		$amount_condition = $metadata_group['conditions'][1];
		$this->assertEquals('purchase.total_amount', $amount_condition['attribute_name']);
		$this->assertEquals('greater_than', $amount_condition['operator']);
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
