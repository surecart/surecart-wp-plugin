<?php

namespace CheckoutEngine\Models\Traits;

use CheckoutEngine\Models\Subscription;

/**
 * If the model has an attached customer.
 */
trait HasSubscriptions {
	/**
	 * Set the subscriptions attribute
	 *
	 * @param  object $value Subscription data array.
	 * @return void
	 */
	public function setSubscriptionAttribute( $value ) {
		$models = [];
		if ( ! empty( $value->data ) && is_array( $value->data ) ) {
			foreach ( $value->data as $attributes ) {
				$models[] = new Subscription( $attributes );
			}
			$value->data = $models;
		}
		$this->attributes['subscriptions'] = $value;
	}

	/**
	 * Does this have subscriptions?
	 *
	 * @return boolean
	 */
	public function hasSubscriptions() {
		return count( $this->attributes['subscriptions'] ?? [] ) > 0;
	}
}
