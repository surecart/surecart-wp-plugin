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
		return __( 'Cancel a SureCart subscription by ID.', 'surecart' );
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
	 */
	public function execute( array $input ): array {
		$id   = sanitize_text_field( $input['id'] );
		$args = array();

		if ( ! empty( $input['cancel_behavior'] ) ) {
			$allowed = array( 'immediate', 'pending' );
			$behavior = sanitize_text_field( $input['cancel_behavior'] );
			if ( ! in_array( $behavior, $allowed, true ) ) {
				return $this->error(
					/* translators: %s: comma-separated list of valid cancel_behavior values */
					sprintf( __( 'Invalid cancel_behavior. Allowed values: %s', 'surecart' ), implode( ', ', $allowed ) )
				);
			}
			$args['cancel_behavior'] = $behavior;
		}

		$subscription = Subscription::where( array_merge( array( 'id' => $id ), $args ) )->cancel();
		if ( is_wp_error( $subscription ) ) {
			return $this->error( $subscription->get_error_message() );
		}

		return $this->success(
			array(
				'subscription' => $this->model_to_array( $subscription ),
			)
		);
	}
}
