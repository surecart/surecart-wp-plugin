<?php

namespace SureCart\Models\Traits;

use SureCart\Models\ShippingChoice;

/**
 * If the model has shipping choices.
 */
trait HasShippingChoices {
	/**
	 * Set the shipping choices attribute
	 *
	 * @param  object $value shipping choices item data array.
	 * @return void
	 */
	public function setShippingChoicesAttribute( $value ) {
		$this->setCollection( 'shipping_choices', $value, ShippingChoice::class );
	}
}
