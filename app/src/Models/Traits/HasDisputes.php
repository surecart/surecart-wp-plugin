<?php

namespace SureCart\Models\Traits;

use SureCart\Models\Dispute;

/**
 * If the model has disputes.
 */
trait HasDisputes {
	/**
	 * Set the disputes attribute.
	 *
	 * @param object $value Array of dispute objects.
	 *
	 * @return void
	 */
	public function setDisputesAttribute( $value ) {
		$this->setCollection( 'disputes', $value, Dispute::class );
	}
}
