<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Customer;

/**
 * Get the rule-based filter schema for customers.
 */
class GetCustomersFilterSchema extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-customers-filter-schema';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get Customers Filter Schema', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve the filterable attributes for customers. Each attribute exposes a key (use as attribute_name), a type, the allowed operators (use as operator_label), and supported_values — the only allowed values for enum/dropdown fields. Call this before filter-customers to learn valid attributes, operators, and values.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_annotations(): array {
		return array(
			'readonly'    => true,
			'destructive' => false,
			'idempotent'  => true,
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_instructions(): string {
		return 'Call this BEFORE filter-customers to discover what you can filter on. For each attribute, "key" is the attribute_name you pass to filter-customers, "operators" are the allowed operator_label values, and "supported_values" lists the ONLY valid comparison_value options for enum/dropdown attributes. Always use an exact supported_value for those fields. This takes no input.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_customers' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'success'    => array( 'type' => 'boolean' ),
				'object'     => array( 'type' => 'string' ),
				'schema_id'  => array( 'type' => 'string' ),
				'attributes' => array(
					'type'  => 'array',
					'items' => array( 'type' => 'object' ),
				),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param array $input The input data.
	 */
	public function execute( array $input ) {
		$schema = Customer::filterSchema();
		if ( is_wp_error( $schema ) ) {
			return $schema;
		}

		return $this->success(
			array(
				'object'     => $schema->object ?? 'rule_schema',
				'schema_id'  => $schema->schema_id ?? '',
				'attributes' => array_map( array( $this, 'model_to_array' ), (array) ( $schema->attributes ?? array() ) ),
			)
		);
	}
}
