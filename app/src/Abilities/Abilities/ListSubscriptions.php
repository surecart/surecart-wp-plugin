<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Subscription;

/**
 * List subscriptions with filters.
 */
class ListSubscriptions extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/list-subscriptions';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'List Subscriptions', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a paginated list of SureCart subscriptions. Supports filtering by status, customer, price, and product. Returns subscription summaries with IDs, statuses, and billing details.', 'surecart' );
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
		return 'Use this to browse or filter subscriptions. Common status values: active, trialing, past_due, canceled, completed. For full details on a single subscription, use get-subscription instead. Only known parameters are accepted: status, customer, price, product, page, per_page.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_subscriptions' );
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
					'description' => __( 'Filter by subscription status (active, trialing, past_due, canceled, completed).', 'surecart' ),
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
					'description' => __( 'Number of subscriptions per page (max 100).', 'surecart' ),
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
				'success'       => array( 'type' => 'boolean' ),
				'subscriptions' => array(
					'type'  => 'array',
					'items' => array( 'type' => 'object' ),
				),
				'pagination'    => array(
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

		if ( ! empty( $input['status'] ) ) {
			$args['status'] = array( sanitize_text_field( $input['status'] ) );
		}

		if ( ! empty( $input['customer_id'] ) ) {
			$args['customer_ids'] = array( sanitize_text_field( $input['customer_id'] ) );
		}

		$subscriptions = Subscription::where( $args )->paginate(
			array(
				'page'     => $page,
				'per_page' => $per_page,
			)
		);
		if ( is_wp_error( $subscriptions ) ) {
			return $subscriptions;
		}

		return $this->success(
			array(
				'subscriptions' => array_map( array( $this, 'model_to_array' ), $subscriptions->data ?? array() ),
				'pagination'    => array(
					'count' => $subscriptions->pagination->count ?? 0,
					'page'  => $page,
					'limit' => $per_page,
				),
			)
		);
	}
}
