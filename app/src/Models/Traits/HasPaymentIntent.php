<?php

namespace CheckoutEngine\Models\Traits;

use CheckoutEngine\Models\PaymentIntent;

/**
 * If the model has an attached customer.
 */
trait HasPaymentIntent {
	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setPaymentIntentAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['payment_intent'] = $value;
			return;
		}
		$this->attributes['payment_intent'] = new PaymentIntent( $value );
	}
}
