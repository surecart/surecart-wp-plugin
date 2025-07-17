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
	protected $endpoint = 'rule_strings';

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $object_name = 'rule_string';

	/**
	 * Gets Rule String Schema.
	 *
	 * @param string $schema_id Schema ID.
	 *
	 * @return $rule_schema|\WP_Error
	 */
	protected function getSchema( $schema_id = null ) {
		$rule_schema = \SureCart::request(
			$this->endpoint . '/schema/' . $schema_id,
			[
				'method' => 'GET',
			]
		);

		if ( is_wp_error( $rule_schema ) ) {
			return $rule_schema;
		}

		return $rule_schema;
	}

	/**
	 * Construct a Rule String from JSON.
	 *
	 * @param string $rule_json Rule JSON.
	 *
	 * @return $rule_string|\WP_Error
	 */
	protected function construct( $rule_json = null ) {
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
	protected function deconstruct( $rule_string = null ) {
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

		return $rule_json;
	}
}
