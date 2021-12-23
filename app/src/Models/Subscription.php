<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\SubscriptionItem;
use CheckoutEngine\Models\CheckoutSession;
use CheckoutEngine\Models\Customer;

/**
 * Subscription model
 */
class Subscription extends Model {
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
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setCheckoutSessionAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['checkout_session'] = $value;
			return;
		}
		$this->attributes['checkout_session'] = new CheckoutSession( $value );
	}

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setCustomerAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['customer'] = $value;
			return;
		}
		$this->attributes['customer'] = new Customer( $value );
	}

	/**
	 * Set the product attribute
	 *
	 * @param  object $value Product properties.
	 * @return void
	 */
	public function setSubscriptionItemsAttribute( $value ) {
		$models = [];
		if ( ! empty( $value->data ) && is_array( $value->data ) ) {
			foreach ( $value->data as $attributes ) {
				$models[] = new SubscriptionItem( $attributes );
			}
			$value->data = $models;
		}
		$this->attributes['subscription_items'] = $value;
	}

	/**
	 * Cancel a subscription
	 *
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
}
