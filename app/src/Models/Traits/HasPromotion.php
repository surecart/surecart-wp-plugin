<?php

namespace SureCart\Models\Traits;

use SureCart\Models\Promotion;

/**
 * If the model has an attached customer.
 */
trait HasPromotion {
	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setPromotionAttribute( $value ) {
		$this->setRelation( 'promotion', $value, Promotion::class );
	}

	/**
	 * Get the relation id attribute
	 *
	 * @return string
	 */
	public function getPromotionIdAttribute() {
		return $this->getRelationId( 'promotion' );
	}
}
