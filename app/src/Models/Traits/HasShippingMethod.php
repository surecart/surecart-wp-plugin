<?php

namespace SureCart\Models\Traits;

use SureCart\Models\ShippingMethod;

/**
 * If the model has shipping method.
 */
trait HasShippingMethod {
	/**
	 * Set the shipping method attribute
	 *
	 * @param  object $value shipping method item data.
	 * @return void
	 */
	public function setShippingMethodAttribute( $value ) {
		$this->setRelation( 'shipping_method', $value, ShippingMethod::class );
	}
}
