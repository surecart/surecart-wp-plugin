<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Refund;

/**
 * Create a new refund.
 */
class CreateRefund extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/create-refund';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Create Refund', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Issue a monetary refund against a SureCart charge. Requires the charge ID, refund amount in the smallest currency unit (e.g., cents for USD), and a reason code(duplicate, fraudulent, requested_by_customer, expired_uncaptured_charge). This initiates an irreversible financial transaction that returns money to the customer\'s payment method.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_annotations(): array {
		return array(
			'readonly'    => false,
			'destructive' => true,
			'idempotent'  => false,
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_instructions(): string {
		return 'This is a destructive financial action that cannot be reversed. All three parameters are required: charge (the charge UUID, not charge_id), amount (in smallest currency unit, e.g. 49000 for $490), and reason (one of: duplicate, fraudulent, requested_by_customer, expired_uncaptured_charge). The amount must not exceed the original charge amount minus any previous refunds. A charge that has already been fully refunded cannot be refunded again. Always confirm the refund amount and reason with the user before executing.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'edit_sc_refunds' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'charge'         => array(
					'type'        => 'string',
					'description' => __( 'The charge ID to refund.', 'surecart' ),
				),
				'amount'         => array(
					'type'        => 'integer',
					'description' => __( 'Amount to refund in smallest currency unit (e.g., cents).', 'surecart' ),
				),
				'reason'         => array(
					'type'        => 'string',
					'description' => __( 'Reason for the refund: duplicate, fraudulent, requested_by_customer, or expired_uncaptured_charge.', 'surecart' ),
				),
				'return_request' => array(
					'type'        => 'string',
					'description' => __( 'The return request ID associated with this refund.', 'surecart' ),
				),
				'refund_items'   => array(
					'type'        => 'array',
					'description' => __( 'List of refund items with line_item, quantity, restock, and revoke_purchase fields.', 'surecart' ),
					'items'       => array(
						'type'       => 'object',
						'properties' => array(
							'line_item'       => array(
								'type'        => 'string',
								'description' => __( 'The line item ID.', 'surecart' ),
							),
							'quantity'        => array(
								'type'        => 'integer',
								'description' => __( 'Number of products being returned.', 'surecart' ),
							),
							'restock'         => array(
								'type'        => 'boolean',
								'description' => __( 'Whether to restock the line item.', 'surecart' ),
							),
							'revoke_purchase' => array(
								'type'        => 'boolean',
								'description' => __( 'Whether to revoke the associated purchase.', 'surecart' ),
							),
						),
					),
				),
			),
			'required'   => array( 'charge', 'amount', 'reason' ),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'success' => array( 'type' => 'boolean' ),
				'refund'  => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ) {
		$data = array(
			'charge' => sanitize_text_field( $input['charge'] ),
			'amount' => absint( $input['amount'] ),
			'reason' => sanitize_text_field( $input['reason'] ),
		);

		if ( ! empty( $input['return_request'] ) ) {
			$data['return_request'] = sanitize_text_field( $input['return_request'] );
		}

		if ( ! empty( $input['refund_items'] ) && is_array( $input['refund_items'] ) ) {
			$data['refund_items'] = array_map(
				function ( $item ) {
					$refund_item = array();
					if ( ! empty( $item['line_item'] ) ) {
						$refund_item['line_item'] = sanitize_text_field( $item['line_item'] );
					}
					if ( isset( $item['quantity'] ) ) {
						$refund_item['quantity'] = absint( $item['quantity'] );
					}
					if ( isset( $item['restock'] ) ) {
						$refund_item['restock'] = (bool) $item['restock'];
					}
					if ( isset( $item['revoke_purchase'] ) ) {
						$refund_item['revoke_purchase'] = (bool) $item['revoke_purchase'];
					}
					return $refund_item;
				},
				$input['refund_items']
			);
		}

		$refund = Refund::create( $data );
		if ( is_wp_error( $refund ) ) {
			return $refund;
		}

		return $this->success(
			array(
				'refund' => $this->model_to_array( $refund ),
			)
		);
	}
}
