<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Order;

/**
 * Filter orders with a rule tree.
 */
class FilterOrders extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/filter-orders';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Filter Orders', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a paginated list of orders matching a rule tree. Supports single conditions and nested and/or groups across any filterable attribute. Call get-orders-filter-schema first to discover valid attribute_name, operator_label, and supported_values.', 'surecart' );
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
		return 'Returns orders matching a rule tree. Call get-orders-filter-schema FIRST to discover valid attribute_name, operator_label, and supported_values. Enum/dropdown fields require an EXACT supported_value (even when the operator is "contains"). Dates use YYYY-MM-DD. comparison_value is always a string. A single condition looks like {"type":"condition","attribute_name":"status","operator_label":"is","comparison_value":"paid"}. A group looks like {"type":"group","combinator":"and","conditions":[{"type":"condition","attribute_name":"status","operator_label":"is","comparison_value":"paid"},{"type":"condition","attribute_name":"order_type","operator_label":"is","comparison_value":"checkout"}]}. Use filter-orders for multi-condition, AND/OR, nested, or non-status attributes; use list-orders for a simple single-status browse.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_orders' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'filter'   => array(
					'type'        => 'object',
					'description' => __( 'The rule tree to filter by. A single condition is { "type":"condition", "attribute_name":<key from filter schema>, "operator_label":<one of the attribute operators>, "comparison_value":<string value> }. A group is { "type":"group", "combinator":"and"|"or", "conditions":[ <condition or nested group>, ... ] }. Groups may be nested. Call get-orders-filter-schema to discover valid attribute_name, operator_label, and supported_values.', 'surecart' ),
				),
				'page'     => array(
					'type'        => 'integer',
					'description' => __( 'Page number for pagination.', 'surecart' ),
					'default'     => 1,
				),
				'per_page' => array(
					'type'        => 'integer',
					'description' => __( 'Number of orders per page (max 100).', 'surecart' ),
					'default'     => 10,
				),
			),
			'required'   => array( 'filter' ),
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
				'orders'     => array(
					'type'  => 'array',
					'items' => array( 'type' => 'object' ),
				),
				'pagination' => array(
					'type'       => 'object',
					'properties' => array(
						'count' => array( 'type' => 'integer' ),
						'page'  => array( 'type' => 'integer' ),
						'limit' => array( 'type' => 'integer' ),
					),
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
		$rules = $this->parse_json_or_array( $input['filter'] ?? null );
		if ( null === $rules ) {
			return $this->error( 'invalid_filter', __( 'The filter must be a condition or group object.', 'surecart' ) );
		}

		$rules = $this->sanitize_rule_tree( $rules );
		if ( is_wp_error( $rules ) ) {
			return $rules;
		}

		$page     = max( 1, absint( $input['page'] ?? 1 ) );
		$per_page = max( 1, min( absint( $input['per_page'] ?? 10 ), 100 ) );

		$result = Order::filter(
			$rules,
			array(
				'page'     => $page,
				'per_page' => $per_page,
			)
		);
		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return $this->success(
			array(
				'orders'     => array_map( array( $this, 'model_to_array' ), $result->data ?? array() ),
				'pagination' => array(
					'count' => $result->pagination->count ?? 0,
					'page'  => $page,
					'limit' => $per_page,
				),
			)
		);
	}
}
