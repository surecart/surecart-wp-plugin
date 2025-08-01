<?php
namespace SureCart\Models;

/**
 * Handle working of Rule String.
 */
class RuleString extends Model {
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
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setGroupsAttribute( $value ) {
		$this->attributes['groups'] = $this->handleCustomAttributes( $value );
	}

	/**
	 * Construct a Rule String from JSON.
	 *
	 * @param string $schema_id Schema ID.
	 * @param array  $groups Groups.
	 *
	 * @return $rule_string|\WP_Error
	 */
	public function construct( $schema_id, $groups ) {
		if ( $schema_id ) {
			$this->setAttribute( 'schema_id', $schema_id );
		}

		if ( $groups ) {
			$this->setAttribute( 'groups', $groups );
		}

		if ( empty( $this->attributes['schema_id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please set the schema_id' );
		}

		$rule_string = \SureCart::request(
			$this->endpoint . '/construct',
			[
				'method' => 'POST',
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $rule_string ) ) {
			return $rule_string;
		}

		$this->resetAttributes();

		$this->fill( $rule_string );

		return $this;
	}

	/**
	 * Deconstruct a Rule String from JSON.
	 *
	 * @param string $schema_id Schema ID.
	 * @param array  $rule_string Rule String.
	 *
	 * @return $rule_string|\WP_Error
	 */
	public function deconstruct( $schema_id, $rule_string ) {
		if ( $schema_id ) {
			$this->setAttribute( 'schema_id', $schema_id );
		}

		if ( empty( $this->attributes['schema_id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please set the schema_id' );
		}

		if ( $rule_string ) {
			$this->setAttribute( 'rule_string', $rule_string );
		}

		$rule_string = \SureCart::request(
			$this->endpoint . '/deconstruct',
			[
				'method' => 'POST',
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $rule_string ) ) {
			return $rule_string;
		}

		$this->resetAttributes();

		$this->fill( $rule_string );

		return $this;
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
