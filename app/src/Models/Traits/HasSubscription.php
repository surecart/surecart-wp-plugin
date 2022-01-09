<?php

namespace CheckoutEngine\Models\Traits;

use CheckoutEngine\Models\Subscription;

/**
 * If the model has an attached customer.
 */
trait HasSubscription {
	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setSubscriptionAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['subscription'] = $value;
			return;
		}
		$this->attributes['subscription'] = new Subscription( $value );
	}
}
