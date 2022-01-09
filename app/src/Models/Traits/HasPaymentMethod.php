<?php

namespace CheckoutEngine\Models\Traits;

use CheckoutEngine\Models\PaymentMethod;

/**
 * If the model has an attached customer.
 */
trait HasPaymentMethod {
	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setPaymentMethodAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['payment_intent'] = $value;
			return;
		}
		$this->attributes['payment_intent'] = new PaymentMethod( $value );
	}
}
