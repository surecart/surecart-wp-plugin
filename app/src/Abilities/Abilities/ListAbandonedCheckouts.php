<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\AbandonedCheckout;

/**
 * List abandoned checkouts with filters.
 */
class ListAbandonedCheckouts extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/list-abandoned-checkouts';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'List Abandoned Checkouts', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a paginated list of SureCart abandoned checkouts. Supports filtering by notification status, customer, and live/test mode. Each item includes its associated checkout, customer, and recovered checkout (if any).', 'surecart' );
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
		return 'Use this to browse abandoned checkouts (carts a customer started but did not complete). Filter by notification_status (not_scheduled, scheduled, sent) to see where each one is in the recovery email flow, or by customer_id to inspect a single customer. By default only live mode results are returned; set live_mode to false for test mode. For full details on a single abandoned checkout, use get-abandoned-checkout instead. Only known parameters are accepted: notification_status, customer_id, live_mode, page, per_page.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_checkouts' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'notification_status' => array(
					'type'        => 'string',
					'description' => __( 'Filter by notification status.', 'surecart' ),
					'enum'        => $this->get_allowed_notification_statuses(),
				),
				'customer_id'         => array(
					'type'        => 'string',
					'description' => __( 'Filter by customer ID.', 'surecart' ),
				),
				'live_mode'           => array(
					'type'        => 'boolean',
					'description' => __( 'Filter by mode. Defaults to true (live abandoned checkouts). Set to false to list test mode results.', 'surecart' ),
					'default'     => true,
				),
				'page'                => array(
					'type'        => 'integer',
					'description' => __( 'Page number for pagination.', 'surecart' ),
					'default'     => 1,
				),
				'per_page'            => array(
					'type'        => 'integer',
					'description' => __( 'Number of abandoned checkouts per page (max 100).', 'surecart' ),
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
				'success'             => array( 'type' => 'boolean' ),
				'abandoned_checkouts' => array(
					'type'  => 'array',
					'items' => array( 'type' => 'object' ),
				),
				'pagination'          => array(
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
	 * Notification status values accepted by the abandoned_checkouts API.
	 *
	 * @return string[]
	 */
	private function get_allowed_notification_statuses(): array {
		return array( 'not_scheduled', 'scheduled', 'sent' );
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

		if ( ! empty( $input['notification_status'] ) ) {
			$status = sanitize_text_field( $input['notification_status'] );
			if ( ! in_array( $status, $this->get_allowed_notification_statuses(), true ) ) {
				return $this->error(
					'invalid_notification_status',
					/* translators: %s: comma-separated list of valid notification_status values */
					sprintf( __( 'Invalid notification_status. Allowed values: %s', 'surecart' ), implode( ', ', $this->get_allowed_notification_statuses() ) )
				);
			}
			// API expects array form for this filter.
			$args['notification_status'] = array( $status );
		}

		if ( ! empty( $input['customer_id'] ) ) {
			$args['customer_ids'] = array( sanitize_text_field( $input['customer_id'] ) );
		}

		// Default to live mode; only override when caller explicitly passes false.
		if ( isset( $input['live_mode'] ) && false === $input['live_mode'] ) {
			$args['live_mode'] = false;
		}

		$abandoned = AbandonedCheckout::where( $args )
			->with( array( 'recovered_checkout', 'checkout', 'customer' ) )
			->paginate(
				array(
					'page'     => $page,
					'per_page' => $per_page,
				)
			);
		if ( is_wp_error( $abandoned ) ) {
			return $abandoned;
		}

		return $this->success(
			array(
				'abandoned_checkouts' => array_map( array( $this, 'model_to_array' ), $abandoned->data ?? array() ),
				'pagination'          => array(
					'count' => $abandoned->pagination->count ?? 0,
					'page'  => $page,
					'limit' => $per_page,
				),
			)
		);
	}
}
