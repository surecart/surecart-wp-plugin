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
				'id' => array(
					'type'        => 'string',
					'description' => __( 'The subscription ID to cancel.', 'surecart' ),
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
		$id = sanitize_text_field( $input['id'] );

		$subscription = Subscription::where( array( 'id' => $id ) )->cancel();
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
