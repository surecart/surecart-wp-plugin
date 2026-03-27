<?php
namespace SureCart\Models;

/**
 * Handle working of Rule String.
 */
class RuleSchema extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	public $endpoint = 'auto_fees/rule_schema';

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	public $object_name = 'rule_schema';

	/**
	 * Rule Schema.
	 */
	protected function getIdAttribute() {
		return str_replace( 'auto_fee__', '', $this->schema_id );
	}

	/**
	 * Rule Schema.
	 */
	protected function getRuleSchemaAttribute() {
		if ( empty( $this->attributes ) || empty( $this->attributes['attributes'] ) ) {
			return [];
		}

		// Add wp_user_role attribute.
		$this->attributes['attributes'][] = (object) [
			'key'       => 'wp_user_role',
			'metadata'  => true,
			'type'      => 'string',
			'operators' => [
				'is',
				'is_not',
			],
		];

		// Remove the metadata & checkout.metadata attributes.
		$this->attributes['attributes'] = array_values(
			array_filter(
				$this->attributes['attributes'],
				function ( $attribute ) {
					return ! in_array( $attribute->key, [ 'metadata', 'checkout.metadata' ], true );
				}
			)
		);

		return $this->attributes['attributes'];
	}
}
