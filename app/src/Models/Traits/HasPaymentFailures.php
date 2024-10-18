<?php

namespace SureCart\Models\Traits;

use SureCart\Models\PaymentFailure;

/**
 * If the model
 */
trait HasPaymentFailures {
	/**
	 * Set the payment_failures attribute
	 *
	 * @param object $value Array of payment_failure objects.
	 *
	 * @return void
	 */
	public function setPamentFailuresAttribute( $value ) {
		$this->setCollection( 'payment_failures', $value, PaymentFailure::class );
	}
}
