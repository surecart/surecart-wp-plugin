<?php

namespace SureCart\Models\Traits;

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

	/**
	 * Get the shipping address attribute
	 *
	 * @return string|null The shipping address.
	 */
	public function getShippingAddressDisplayAttribute() {
		return $this->shipping_address->formatted_string ?? null;
	}
}
