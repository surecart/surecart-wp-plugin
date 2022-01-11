<?php

namespace CheckoutEngine\Models\Traits;

use CheckoutEngine\Models\PaymentIntent;

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
		$this->setRelation( 'payment_intent', $value, PaymentIntent::class );
	}
}
