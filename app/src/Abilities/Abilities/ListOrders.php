<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Order;

/**
 * List orders with filters.
 */
class ListOrders extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/list-orders';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'List Orders', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'List SureCart orders with optional filters for status, customer, and pagination.', 'surecart' );
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
				'status'      => array(
					'type'        => 'string',
					'description' => __( 'Filter by order status.', 'surecart' ),
				),
				'customer_id' => array(
					'type'        => 'string',
					'description' => __( 'Filter by customer ID.', 'surecart' ),
				),
				'page'        => array(
					'type'        => 'integer',
					'description' => __( 'Page number for pagination.', 'surecart' ),
					'default'     => 1,
				),
				'per_page'    => array(
					'type'        => 'integer',
					'description' => __( 'Number of orders per page (max 100).', 'surecart' ),
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
	 */
	public function execute( array $input ): array {
		$args = array(
			'page'     => absint( $input['page'] ?? 1 ),
			'per_page' => min( absint( $input['per_page'] ?? 10 ), 100 ),
		);

		if ( ! empty( $input['status'] ) ) {
			$args['status'] = sanitize_text_field( $input['status'] );
		}

		if ( ! empty( $input['customer_id'] ) ) {
			$args['customer_ids'] = array( sanitize_text_field( $input['customer_id'] ) );
		}

		$orders = Order::where( $args )->paginate();
		if ( is_wp_error( $orders ) ) {
			return $this->error( $orders->get_error_message() );
		}

		return $this->success(
			array(
				'orders'     => array_map( array( $this, 'model_to_array' ), $orders->data ?? array() ),
				'pagination' => array(
					'count' => $orders->pagination->count ?? 0,
					'page'  => $args['page'],
					'limit' => $args['per_page'],
				),
			)
		);
	}
}
