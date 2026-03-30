<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Subscription;

/**
 * Cancel a subscription.
 */
class CancelSubscription extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/cancel-subscription';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Cancel Subscription', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Cancel an active SureCart subscription by its ID. Supports immediate cancellation or pending cancellation at the end of the current billing period. This stops recurring billing and may revoke access to associated products.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_annotations(): array {
		return array(
			'readonly'    => false,
			'destructive' => true,
			'idempotent'  => true,
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_instructions(): string {
		return 'Always confirm with the user before canceling. Ask whether they want immediate cancellation or at end of billing period. Immediate cancellation stops access right away; pending lets the customer use their remaining paid time.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'edit_sc_subscriptions' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'id'              => array(
					'type'        => 'string',
					'description' => __( 'The subscription ID to cancel.', 'surecart' ),
				),
				'cancel_behavior' => array(
					'type'        => 'string',
					'description' => __( 'When to cancel: "immediate" cancels now, "pending" cancels at end of the current billing period.', 'surecart' ),
					'enum'        => array( 'immediate', 'pending' ),
				),
			),
			'required'   => array( 'id' ),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'success'      => array( 'type' => 'boolean' ),
				'subscription' => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param array $input The input data.
	 */
	public function execute( array $input ) {
		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'A subscription ID is required.', 'surecart' ) );
		}

		$data = array();

		if ( ! empty( $input['cancel_behavior'] ) ) {
			$allowed  = array( 'immediate', 'pending' );
			$behavior = sanitize_text_field( $input['cancel_behavior'] );
			if ( ! in_array( $behavior, $allowed, true ) ) {
				return $this->error(
					'invalid_cancel_behavior',
					/* translators: %s: comma-separated list of valid cancel_behavior values */
					sprintf( __( 'Invalid cancel_behavior. Allowed values: %s', 'surecart' ), implode( ', ', $allowed ) )
				);
			}
			$data['cancel_behavior'] = $behavior;
		}

		$subscription = ( new Subscription( $data ) )->cancel( $id );
		if ( is_wp_error( $subscription ) ) {
			return $subscription;
		}

		return $this->success(
			array(
				'subscription' => $this->model_to_array( $subscription ),
			)
		);
	}
}
