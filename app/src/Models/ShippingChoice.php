<?php

namespace SureCart\Models;

use SureCart\Support\Currency;
use SureCart\Models\Traits\HasShippingMethod;

/**
 * ShippingChoice model.
 */
class ShippingChoice extends Model {
	use HasShippingMethod;

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'shipping_choice';

	/**
	 * Get the display amount attribute.
	 *
	 * @return string
	 */
	public function getDisplayAmountAttribute() {
		return ! empty( $this->amount ) ? Currency::format( $this->amount, $this->currency ) : '';
	}
}
