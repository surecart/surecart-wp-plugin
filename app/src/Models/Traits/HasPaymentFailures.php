<?php

namespace SureCart\Models\Traits;

use SureCart\Models\PaymentFailure;

/**
 * If the model has payment failures.
 */
trait HasPaymentFailures {
	/**
	 * Set the payment_failures attribute
	 *
	 * @param object $value Array of payment_failure objects.
	 *
	 * @return void
	 */
	public function setPaymentFailuresAttribute( $value ) {
		$this->setCollection( 'payment_failures', $value, PaymentFailure::class );
	}
}
