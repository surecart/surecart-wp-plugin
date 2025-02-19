<?php

namespace SureCart\Models\Traits;

use SureCart\Models\PlatformFee;

/**
 * If the model has an attached platform fee.
 */
trait HasPlatformFee {
    
	/**
	 * Set the platform fee attribute
	 *
	 * @param  string $value Platform Fee properties.
	 * @return void
	 */
	public function setPlatformFeeAttribute( $value ) {
		$this->setRelation( 'platform_fee', $value, PlatformFee::class );
	}

	/**
	 * Get the relation id attribute
	 *
	 * @return string
	 */
	public function getPlatformFeeIdAttribute() {
		return $this->getRelationId( 'platform_fee' );
	}
}
