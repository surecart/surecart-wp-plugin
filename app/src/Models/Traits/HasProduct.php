<?php

namespace CheckoutEngine\Models\Traits;

use CheckoutEngine\Models\Product;

/**
 * If the model has an attached customer.
 */
trait HasProduct {
	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setProductAttribute( $value ) {
		$this->setRelation( 'product', $value, Product::class );
	}
}
