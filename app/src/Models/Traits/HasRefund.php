<?php

namespace CheckoutEngine\Models\Traits;

use CheckoutEngine\Models\Refund;

/**
 * If the model has an attached customer.
 */
trait HasRefund {
	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setRefundAttribute( $value ) {
		$this->setRelation( 'refund', $value, Refund::class );
	}
}
