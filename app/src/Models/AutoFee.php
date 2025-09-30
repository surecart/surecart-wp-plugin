<?php
namespace SureCart\Models;

/**
 * Holds the data of the order bump.
 */
class AutoFee extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'auto_fees';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'auto_fee';

	/**
	 * Set the rules attribute.
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setRulesAttribute( $value ) {
		$this->attributes['rules'] = $this->handleCustomAttributes( $value );
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
