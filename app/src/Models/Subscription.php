<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Traits\HasCustomer;
use CheckoutEngine\Models\Traits\HasOrder;
use CheckoutEngine\Models\Traits\HasPrice;

/**
 * Subscription model
 */
class Subscription extends Model {
	use HasCustomer, HasOrder, HasPrice;

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

		$canceled = \CheckoutEngine::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/cancel/',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $canceled ) ) {
			return $canceled;
		}

		$this->resetAttributes();

		$this->fill( $canceled );

		$this->fireModelEvent( 'canceled' );

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

		$renewed = \CheckoutEngine::request(
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

		$invoice = \CheckoutEngine::request(
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
}

