<?php

namespace SureCart\Models\Traits;

use SureCart\Models\AutoFee;

/**
 * If the model has auto fee rules.
 */
trait HasAutoFeeRules {
	/**
	 * Set the rules attribute.
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setRulesAttribute( $value ) {
		$this->attributes['rules'] = $this->handleCustomAttributes( $value, 'set' );
	}

	/**
	 * Get the rules attribute.
	 *
	 * @param  string $value Product properties.
	 * @return array
	 */
	public function getRulesAttribute( $value ) {
		return $this->handleCustomAttributes( $value, 'get' );
	}


	/**
	 * Handle Custom Attributes.
	 *
	 * @param array  $rule_json Rule JSON.
	 * @param string $type get or set.
	 * @return array $rule_json
	 */
	public function handleCustomAttributes( $rule_json, $type ) {
		if ( empty( $rule_json ) || empty( $type ) ) {
			return [];
		}

		$rule_array = $this->convertObjectToArray( $rule_json );

		if ( empty( $rule_array ) || ! is_array( $rule_array ) ) {
			return [];
		}

		if ( isset( $rule_array['conditions'] ) && empty( $rule_array['conditions'] ) ) {
			return is_object( $rule_json ) ? (object) [] : [];
		}

		$fee_target     = $this->attributes['fee_target'] ?? 'line_item';
		$attribute_name = 'line_item' === $fee_target ? 'checkout.metadata' : 'metadata';

		foreach ( $rule_array as $key => &$value ) {
			if ( is_array( $value ) ) {
				$value = $this->handleCustomAttributes( $value, $type );

				if ( empty( $value['attribute_name'] ) ) {
					continue;
				}

				if ( 'wp_user_role' === $value['attribute_name'] && 'set' === $type ) {
					$value['attribute_name'] = $attribute_name;
					$value['metadata_key']   = 'wp_user_role';
					continue;
				}

				if ( empty( $value['metadata_key'] ) ) {
					continue;
				}

				if ( $attribute_name === $value['attribute_name'] && 'wp_user_role' === $value['metadata_key'] && 'get' === $type ) {
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
