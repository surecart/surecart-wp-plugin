<?php

namespace CheckoutEngine\Models\Traits;

use CheckoutEngine\Models\Price;

/**
 * If the model has an attached customer.
 */
trait HasPrice {
	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setPriceAttribute( $value ) {
		$this->setRelation( 'price', $value, Price::class );
	}
}
