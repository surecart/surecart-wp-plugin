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

	/**
	 * Set the shipping choices display amount.
	 *
	 * @param array|object $value Value to set.
	 * @return $this
	 */
	protected function setShippingChoicesAttribute( $value ) {
		if ( empty( $value ) || ! isset( $value->data ) || ! is_array( $value->data ) ) {
			return $this;
		}

		foreach ( $value->data as $key => $choice ) {
			if ( ! empty( $choice->amount ) ) {
				$currency               = $choice->currency ?? 'usd';
				$choice->display_amount = Currency::format( $choice->amount, $currency );
			}
		}

		$this->attributes['shipping_choices'] = $value;
		return $this;
	}
}
