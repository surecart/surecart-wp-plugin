<?php

namespace CheckoutEngine\Models\Traits;

trait HasDiscount {
	/**
	 * Always set discount as object.
	 *
	 * @param array|object $value Value to set.
	 * @return $this
	 */
	protected function setDiscountAttribute( $value ) {
		$this->attributes['discount'] = (object) $value;
		return $this;
	}
}
