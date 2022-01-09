<?php

namespace CheckoutEngine\Models\Traits;

use CheckoutEngine\Models\Order;

/**
 * If the model has an attached customer.
 */
trait HasOrder {
	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setOrderAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['order'] = $value;
			return;
		}
		$this->attributes['order'] = new Order( $value );
	}
}
