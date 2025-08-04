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
	public $endpoint = 'rule_strings/schema';

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	public $object_name = 'rule_schema';

	/**
	 * Has the product changed?
	 */
	protected function getRuleSchemaAttribute() {
		if ( empty( $this->attributes ) || empty( $this->attributes['attributes'] ) ) {
			return [];
		}

		// Add wp_user_role attribute.
		$this->attributes['attributes'][] = (object) [
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

		return $this->attributes['attributes'];
	}
}
