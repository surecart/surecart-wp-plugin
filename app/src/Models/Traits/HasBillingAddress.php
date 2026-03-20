<?php

namespace SureCart\Models\Traits;

trait HasBillingAddress {
	/**
	 * Always set billing address as object.
	 *
	 * @param array|object $value Value to set.
	 * @return $this
	 */
	protected function setBillingAddressAttribute( $value ) {
		$this->attributes['billing_address'] = (object) $value;
		return $this;
	}

	/**
	 * Get the billing address attribute
	 *
	 * @return string|null The billing address.
	 */
	public function getBillingAddressDisplayAttribute() {
		if ( $this->billing_matches_shipping ) {
			return $this->shipping_address->formatted_string ?? null;
		}

		return $this->billing_address->formatted_string ?? null;
	}
}
