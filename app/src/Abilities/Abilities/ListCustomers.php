<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Customer;

/**
 * List customers with filters.
 */
class ListCustomers extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/list-customers';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'List Customers', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a paginated list of SureCart customers. Supports filtering by search query and email. Returns customer names, IDs, emails, and associated data.', 'surecart' );
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
		return 'Use this to browse or search the customer list. Use the query parameter to filter by name or email. For full details on a single customer, use get-customer instead.';
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
			'properties' => array(
				'query'    => array(
					'type'        => 'string',
					'description' => __( 'Search query to filter customers by name or email.', 'surecart' ),
				),
				'page'     => array(
					'type'        => 'integer',
					'description' => __( 'Page number for pagination.', 'surecart' ),
					'default'     => 1,
				),
				'per_page' => array(
					'type'        => 'integer',
					'description' => __( 'Number of customers per page (max 100).', 'surecart' ),
					'default'     => 10,
				),
			),
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
				'customers'  => array(
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
	 */
	public function execute( array $input ) {
		$page     = absint( $input['page'] ?? 1 );
		$per_page = max( 1, min( absint( $input['per_page'] ?? 10 ), 100 ) );

		$args = array();

		if ( ! empty( $input['query'] ) ) {
			$args['query'] = sanitize_text_field( $input['query'] );
		}

		$customers = Customer::where( $args )->paginate(
			array(
				'page'     => $page,
				'per_page' => $per_page,
			)
		);
		if ( is_wp_error( $customers ) ) {
			return $customers;
		}

		return $this->success(
			array(
				'customers'  => array_map( array( $this, 'model_to_array' ), $customers->data ?? array() ),
				'pagination' => array(
					'count' => $customers->pagination->count ?? 0,
					'page'  => $page,
					'limit' => $per_page,
				),
			)
		);
	}
}
