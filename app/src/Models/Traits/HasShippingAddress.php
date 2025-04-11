<?php

namespace SureCart\Models\Traits;

use SureCart\Support\Currency;


trait HasShippingAddress {
	/**
	 * Always set discount as object.
	 *
	 * @param array|object $value Value to set.
	 * @return $this
	 */
	protected function setShippingAddressAttribute( $value ) {
		// force either string or object.
		$this->attributes['shipping_address'] = is_string( $value ) ? $value : (object) $value;
		return $this;
	}
}
