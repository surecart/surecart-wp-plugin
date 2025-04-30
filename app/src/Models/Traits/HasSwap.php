<?php

namespace SureCart\Models\Traits;

use SureCart\Models\Swap;

/**
 * If the model has an attached customer.
 */
trait HasSwap {
	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setSwapAttribute( $value ) {
		$this->setRelation( 'swap', $value, Swap::class );
	}

	/**
	 * Get the price id attribute
	 *
	 * @return string
	 */
	public function getSwapIdAttribute() {
		return $this->getRelationId( 'swap' );
	}
}
