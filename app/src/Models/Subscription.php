<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasOrder;
use SureCart\Models\Traits\HasPrice;
use SureCart\Models\Traits\HasPurchase;

/**
 * Subscription model
 */
class Subscription extends Model {
	use HasCustomer, HasOrder, HasPrice, HasPurchase;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'subscriptions';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'subscription';

	/**
	 * Update the model.
	 *
	 * @param array $attributes Attributes to update.
	 * @return $this|false
	 */
	protected function update( $attributes = [] ) {
		// find existing subscription with purchase record.
		$existing = ( new Subscription() )->with( [ 'purchase' ] )->find( $attributes['id'] ?? $this->attributes['id'] );

		// do the update and also get the purchase record.
		$this->with( [ 'purchase' ] );
		$updated = parent::update( $attributes );
		if ( is_wp_error( $updated ) ) {
			return $updated;
		}

		// do the purchase updated event.
		do_action(
			'surecart/purchase_updated',
			$updated->purchase,
			[
				'data' => [
					'object'              => $updated->purchase->toArray(),
					'previous_attributes' => array_filter(
						[
							// conditionally have the previous product and quantity as the previous attributes.
							'product'  => $updated->purchase->product_id !== $existing->purchase->product_id ? ( $existing->purchase->product_id ?? null ) : null,
							'quantity' => $updated->purchase->quantity !== $existing->purchase->quantity ? ( $existing->purchase->quantity ?? 1 ) : null,
						]
					),
				],
			]
		);

		return $this;
	}

	/**
	 * Cancel a subscription
	 *
	 * @param string $id Model id.
	 * @return $this|\WP_Error
	 */
	protected function cancel( $id = null ) {
		if ( $id ) {
			$this->setAttribute( 'id', $id );
		}

		if ( $this->fireModelEvent( 'canceling' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the subscription.' );
		}

		$canceled = $this->with(
			[
				'purchase',
			]
		)->makeRequest(
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			],
			$this->endpoint . '/' . $this->attributes['id'] . '/cancel/'
		);

		if ( is_wp_error( $canceled ) ) {
			return $canceled;
		}

		$this->resetAttributes();

		$this->fill( $canceled );

		$this->fireModelEvent( 'canceled' );

		// purchase revoked event.
		if ( ! empty( $this->purchase->revoked ) ) {
			do_action( 'surecart/purchase_revoked', $this->purchase );
		}

		return $this;
	}

	/**
	 * Renew a subscription.
	 *
	 * @param string $id Model id.
	 * @return $this|\WP_Error
	 */
	protected function renew( $id = null ) {
		if ( $id ) {
			$this->setAttribute( 'id', $id );
		}

		if ( $this->fireModelEvent( 'renewing' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the subscription.' );
		}

		$renewed = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'],
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => [
						'cancel_at_period_end' => false,
					],
				],
			]
		);

		if ( is_wp_error( $renewed ) ) {
			return $renewed;
		}

		$this->resetAttributes();

		$this->fill( $renewed );

		$this->fireModelEvent( 'renewed' );

		return $this;
	}

	/**
	 * Preview the upcoming invoice.
	 *
	 * @return $this|\WP_Error
	 */
	protected function upcomingInvoice( $id = null ) {
		if ( $id ) {
			$this->setAttribute( 'id', $id );
		}

		if ( $this->fireModelEvent( 'previewingUpcomingInvoice' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the subscription' );
		}

		$invoice = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/upcoming_invoice/',
			[
				'method' => 'GET',
				'query'  => array_merge(
					$this->query,
					$this->attributes
				),
			]
		);

		if ( is_wp_error( $invoice ) ) {
			return $invoice;
		}

		$this->resetAttributes();

		$this->fill( $invoice );

		$this->fireModelEvent( 'previewedUpcomingInvoice' );

		return $this;
	}

	/**
	 * Is this subscription a lifetime one?
	 *
	 * @return boolean
	 */
	protected function isLifetime() {
		return $this->attributes['id'] && empty( $this->attributes['current_period_end_at'] );
	}

	/**
	 * Can the user upgrade this subscription?
	 *
	 * @return boolean
	 */
	protected function canBeSwitched() {
		return apply_filters( 'surecart/subscription/can_be_changed', $this->checkIfCanBeSwitched(), $this );
	}

	/**
	 * Can the subscription be changed?
	 *
	 * @return boolean
	 */
	private function checkIfCanBeSwitched() {
		// updates are not enabled for the account.
		if ( empty( \SureCart::account()->portal_protocol->subscription_updates_enabled ) ) {
			return false;
		}
		// already set to canceling.
		if ( $this->attributes['cancel_at_period_end'] ) {
			return false;
		}
		// can't update canceled, incomplete, or past due subscriptions.
		if ( in_array( $this->attributes['status'], [ 'canceled', 'incomplete', 'past_due' ] ) ) {
			return false;
		}
		// must not be lifetime.
		if ( $this->isLifetime() ) {
			return false;
		}
		return true;
	}

	/**
	 * Can we cancel the subscription?
	 *
	 * @return boolean
	 */
	public function canBeCanceled() {
		return apply_filters( 'surecart/subscription/can_be_canceled', $this->checkIfCanBeSwitched(), $this );
	}

	/**
	 * Can the subscription be canceled?
	 *
	 * @return boolean
	 */
	private function checkIfCanBeCanceled() {
		// updates are not enabled for the account.
		if ( empty( \SureCart::account()->portal_protocol->subscription_cancellations_enabled ) ) {
			return false;
		}

		// can't cancel canceled, incomplete, or past due subscriptions.
		if ( in_array( $this->attributes['status'], [ 'canceled', 'incomplete', 'past_due' ] ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Can we update the quantity?
	 *
	 * @return boolean
	 */
	protected function canUpdateQuantity() {
		return apply_filters( 'surecart/subscription/can_update_quantity', $this->checkIfCanBeSwitched(), $this );
	}

	/**
	 * Check if we can update the quantity.
	 *
	 * @return boolean
	 */
	private function checkIfCanUpdateQuantity() {
		// quantity changes are not enabled for this account.
		if ( empty( \SureCart::account()->portal_protocol->subscription_quantity_updates_enabled ) ) {
			return false;
		}
		return true;
	}
}

