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
		return __( 'Retrieve a paginated list of SureCart orders. Supports filtering by order status and customer ID. Returns order summaries with IDs, amounts, statuses, and timestamps.', 'surecart' );
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
		return 'Use this to browse or search orders. Filter by status (paid, processing, draft, payment_failed, void, canceled, requires_approval) and customer. Use canceled for orders shown as Canceled in the dashboard; it is applied as void in the API. For full details on a single order, use get-order instead. Only known parameters are accepted: status, customer, page, per_page.';
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
		$allowed_statuses = $this->get_allowed_order_statuses();

		return array(
			'type'       => 'object',
			'properties' => array(
				'status'      => array(
					'type'        => 'string',
					'description' => __( 'Filter by order status.', 'surecart' ),
					'enum'        => $allowed_statuses,
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
	 * Status values accepted for the orders list filter (matches SureCart order model / admin).
	 *
	 * @return string[]
	 */
	private function get_allowed_order_statuses(): array {
		return array( 'paid', 'payment_failed', 'processing', 'void', 'canceled', 'draft', 'requires_approval' );
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param array $input The input data.
	 */
	public function execute( array $input ) {
		$page     = absint( $input['page'] ?? 1 );
		$per_page = max( 1, min( absint( $input['per_page'] ?? 10 ), 100 ) );

		$args = array();

		if ( ! empty( $input['status'] ) ) {
			$status = sanitize_text_field( $input['status'] );
			if ( ! in_array( $status, $this->get_allowed_order_statuses(), true ) ) {
				return $this->error(
					'invalid_status',
					/* translators: %s: comma-separated list of valid order status values */
					sprintf( __( 'Invalid status. Allowed values: %s', 'surecart' ), implode( ', ', $this->get_allowed_order_statuses() ) )
				);
			}
			// Align with admin orders list: UI "canceled" maps to API status void.
			$args['status'] = 'canceled' === $status ? 'void' : $status;
		}

		if ( ! empty( $input['customer_id'] ) ) {
			$args['customer_ids'] = array( sanitize_text_field( $input['customer_id'] ) );
		}

		$orders = Order::where( $args )->paginate(
			array(
				'page'     => $page,
				'per_page' => $per_page,
			)
		);
		if ( is_wp_error( $orders ) ) {
			return $orders;
		}

		return $this->success(
			array(
				'orders'     => array_map( array( $this, 'model_to_array' ), $orders->data ?? array() ),
				'pagination' => array(
					'count' => $orders->pagination->count ?? 0,
					'page'  => $page,
					'limit' => $per_page,
				),
			)
		);
	}
}
