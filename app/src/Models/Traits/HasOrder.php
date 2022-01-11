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
		$this->setRelation( 'order', $value, Order::class );
	}
}
