<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Period;
use SureCart\Models\Subscription;

/**
 * Update a subscription's renewal date.
 */
class UpdateSubscriptionRenewalDate extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/update-subscription-renewal-date';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Update Subscription Renewal Date', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Extend an active subscription\'s renewal date by a specified number of days or to a custom date. This does not cancel or restart the subscription — it simply pushes the next billing date forward, keeping the subscription active. Useful for granting free time to subscribers.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_annotations(): array {
		return array(
			'readonly'    => false,
			'destructive' => false,
			'idempotent'  => false,
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_instructions(): string {
		return 'Always confirm with the user before updating the renewal date. Verify the subscription ID and desired extension. Either days_to_add or custom_renewal_date must be provided, but not both. The new renewal date must be in the future and on or after the current period end date. This is a non-destructive operation that keeps the subscription active.';
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
				'subscription_id'     => array(
					'type'        => 'string',
					'description' => __( 'The unique identifier of the subscription.', 'surecart' ),
				),
				'days_to_add'         => array(
					'type'        => 'integer',
					'description' => __( 'Number of days to extend the renewal date (e.g., 30, 60, 90). Cannot be used with custom_renewal_date.', 'surecart' ),
				),
				'custom_renewal_date' => array(
					'type'        => 'string',
					'description' => __( 'Set the renewal date to a specific date in YYYY-MM-DD format. Cannot be used with days_to_add.', 'surecart' ),
				),
				'confirm'             => array(
					'type'        => 'boolean',
					'description' => __( 'Confirmation flag for the operation. Must be true to proceed.', 'surecart' ),
				),
			),
			'required'   => array( 'subscription_id', 'confirm' ),
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
				'subscription_id'     => array( 'type' => 'string' ),
				'old_renewal_date'    => array( 'type' => 'string' ),
				'new_renewal_date'    => array( 'type' => 'string' ),
				'subscription_status' => array( 'type' => 'string' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param array $input The input data.
	 */
	public function execute( array $input ) {
		// Require confirmation.
		if ( empty( $input['confirm'] ) ) {
			return $this->error(
				'confirmation_required',
				__( 'You must set confirm to true to update the subscription renewal date.', 'surecart' )
			);
		}

		$id = sanitize_text_field( $input['subscription_id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'A subscription ID is required.', 'surecart' ) );
		}

		$has_days   = isset( $input['days_to_add'] ) && '' !== $input['days_to_add'];
		$has_custom = ! empty( $input['custom_renewal_date'] );

		// Validate that exactly one of the two date options is provided.
		if ( $has_days && $has_custom ) {
			return $this->error(
				'invalid_input',
				__( 'Provide either days_to_add or custom_renewal_date, not both.', 'surecart' )
			);
		}

		if ( ! $has_days && ! $has_custom ) {
			return $this->error(
				'invalid_input',
				__( 'Either days_to_add or custom_renewal_date must be provided.', 'surecart' )
			);
		}

		// Fetch the existing subscription with current_period expanded.
		$subscription = Subscription::with( array( 'current_period' ) )->find( $id );
		if ( is_wp_error( $subscription ) ) {
			return $subscription;
		}

		// Ensure the subscription is active.
		$status = $subscription->status ?? '';
		if ( 'active' !== $status ) {
			return $this->error(
				'invalid_status',
				/* translators: %s: current subscription status */
				sprintf( __( 'The subscription must be active to update the renewal date. Current status: %s', 'surecart' ), $status )
			);
		}

		// Get the current period end timestamp.
		$current_period_end_at = $subscription->current_period_end_at ?? 0;
		if ( empty( $current_period_end_at ) ) {
			return $this->error(
				'no_period_end',
				__( 'This subscription does not have a current period end date. It may be a lifetime subscription.', 'surecart' )
			);
		}

		// Ensure we have the current period ID.
		$current_period = $subscription->current_period ?? null;
		$period_id      = is_object( $current_period ) ? ( $current_period->id ?? '' ) : ( is_string( $current_period ) ? $current_period : '' );
		if ( empty( $period_id ) ) {
			return $this->error(
				'no_current_period',
				__( 'Could not resolve the current billing period for this subscription.', 'surecart' )
			);
		}

		$old_date = new \DateTime();
		$old_date->setTimestamp( $current_period_end_at );

		$now = new \DateTime();

		// Calculate the new renewal date.
		if ( $has_days ) {
			$days = absint( $input['days_to_add'] );
			if ( $days < 1 ) {
				return $this->error( 'invalid_days', __( 'days_to_add must be at least 1.', 'surecart' ) );
			}

			$new_date = clone $old_date;
			$new_date->modify( "+{$days} days" );
		} else {
			$custom_date = sanitize_text_field( $input['custom_renewal_date'] );
			if ( ! $this->is_valid_date( $custom_date ) ) {
				return $this->error( 'invalid_date', __( 'custom_renewal_date must be in YYYY-MM-DD format.', 'surecart' ) );
			}

			$new_date = \DateTime::createFromFormat( 'Y-m-d', $custom_date );
			$new_date->setTime( (int) $old_date->format( 'H' ), (int) $old_date->format( 'i' ), (int) $old_date->format( 's' ) );
		}

		// Validate the new date is in the future.
		if ( $new_date <= $now ) {
			return $this->error( 'invalid_date', __( 'The new renewal date must be in the future.', 'surecart' ) );
		}

		// Validate the new date is on or after the current period end.
		if ( $new_date < $old_date ) {
			return $this->error( 'invalid_date', __( 'The new renewal date must be on or after the current period end date.', 'surecart' ) );
		}

		// Update the Period's end_at — this is how the admin UI extends renewal dates.
		$updated_period = Period::update(
			array(
				'id'     => $period_id,
				'end_at' => $new_date->getTimestamp(),
			)
		);

		if ( is_wp_error( $updated_period ) ) {
			return $updated_period;
		}

		return $this->success(
			array(
				'subscription_id'     => $id,
				'old_renewal_date'    => $old_date->format( 'Y-m-d' ),
				'new_renewal_date'    => $new_date->format( 'Y-m-d' ),
				'subscription_status' => $status,
			)
		);
	}
}
