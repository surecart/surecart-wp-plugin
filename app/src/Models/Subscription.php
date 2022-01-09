<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\SubscriptionItem;
use CheckoutEngine\Models\Traits\HasCustomer;
use CheckoutEngine\Models\Traits\HasOrder;

/**
 * Subscription model
 */
class Subscription extends Model {
	use HasCustomer, HasOrder;

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
