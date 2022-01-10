<?php

namespace CheckoutEngine\Models\Traits;

use CheckoutEngine\Models\Charge;

/**
 * If the model has an attached customer.
 */
trait HasCharge {
	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setChargeAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['charge'] = $value;
			return;
		}
		$this->attributes['charge'] = new Charge( $value );
	}
}
