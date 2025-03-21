<?php

namespace SureCart\Models\Traits;

use SureCart\Models\ServiceFee;

/**
 * If the model has an attached service fee.
 */
trait HasServiceFee {
    
	/**
	 * Set the service fee attribute
	 *
	 * @param  string $value service Fee properties.
	 * @return void
	 */
	public function setServiceFeeAttribute( $value ) {
		$this->setRelation( 'service_fee', $value, ServiceFee::class );
	}

	/**
	 * Get the relation id attribute
	 *
	 * @return string
	 */
	public function getServiceFeeIdAttribute() {
		return $this->getRelationId( 'service_fee' );
	}
}
