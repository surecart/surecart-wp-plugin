<?php
namespace SureCart\Models;

/**
 * Handle working of Rule String.
 */
class RuleString {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	public $endpoint = 'rule_strings';

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	public $object_name = 'rule_string';

	/**
	 * Gets Rule String Schema.
	 *
	 * @param string $schema_id Schema ID.
	 *
	 * @return $rule_schema|\WP_Error
	 */
	public function getSchema( $schema_id = null ) {
		$rule_schema = \SureCart::request(
			$this->endpoint . '/schema/' . $schema_id,
			[
				'method' => 'GET',
			]
		);

		if ( is_wp_error( $rule_schema ) ) {
			return $rule_schema;
		}

		$rule_schema = $this->addWPUserRoleAttribute( $rule_schema );

		return $rule_schema;
	}

	/**
	 * Add WP User Role attribute to the rule schema.
	 *
	 * @param object $rule_schema Rule schema.
	 *
	 * @return object
	 */
	public function addWPUserRoleAttribute( $rule_schema = null ) {
		$rule_schema->attributes[] = (object) [
			'key'               => 'wp_user_role',
			'type'              => 'metadata',
			'operators'         => [
				(object) [
					'label' => 'is',
				],
				(object) [
					'label' => 'is not',
				],
			],
			'acceptable_values' => [],
		];

		return $rule_schema;
	}

	/**
	 * Construct a Rule String from JSON.
	 *
	 * @param string $rule_json Rule JSON.
	 *
	 * @return $rule_string|\WP_Error
	 */
	public function construct( $rule_json = null ) {
		$rule_json   = $this->handleCustomAttributes( $rule_json );
		$rule_string = \SureCart::request(
			$this->endpoint . '/construct',
			[
				'method' => 'POST',
				'body'   => [
					$this->object_name => $rule_json,
				],
			]
		);

		if ( is_wp_error( $rule_string ) ) {
			return $rule_string;
		}

		return $rule_string;
	}

	/**
	 * Deconstruct a Rule String from JSON.
	 *
	 * @param string $rule_string Rule JSON.
	 *
	 * @return $rule_json|\WP_Error
	 */
	public function deconstruct( $rule_string = null ) {
		$rule_json = \SureCart::request(
			$this->endpoint . '/deconstruct',
			[
				'method' => 'POST',
				'body'   => [
					$this->object_name => $rule_string,
				],
			]
		);

		if ( is_wp_error( $rule_json ) ) {
			return $rule_json;
		}

		$rule_json->groups = $this->handleCustomAttributes( $rule_json->groups );

		return $rule_json;
	}

	/**
	 * Handle Custom Attributes.
	 *
	 * @param array $rule_json Rule JSON.
	 *
	 * @return array $rule_json
	 */
	public function handleCustomAttributes( $rule_json ) {
		$rule_array = $this->convertObjectToArray( $rule_json );

		foreach ( $rule_array as $key => &$value ) {
			if ( is_array( $value ) ) {
				$value = $this->handleCustomAttributes( $value );

				if ( empty( $value['attribute_name'] ) ) {
					continue;
				}

				if ( 'wp_user_role' === $value['attribute_name'] ) {
					$value['attribute_name'] = 'checkout.metadata';
					$value['metadata_key']   = 'wp_user_role';
					continue;
				}

				if ( empty( $value['metadata_key'] ) ) {
					continue;
				}

				if ( 'checkout.metadata' === $value['attribute_name'] && 'wp_user_role' === $value['metadata_key'] ) {
					$value['attribute_name'] = 'wp_user_role';
				}
			}
		}

		return is_object( $rule_json ) ? (object) $rule_array : $rule_array;
	}

	/**
	 * Convert Nested Objects to Array
	 *
	 * @param array $data Object.
	 *
	 * @return array $data
	 */
	private function convertObjectToArray( $data ) {
		if ( is_object( $data ) ) {
			$data = get_object_vars( $data );
		}

		if ( is_array( $data ) ) {
			return array_map( [ $this, 'convertObjectToArray' ], $data );
		}

		return $data;
	}
}
