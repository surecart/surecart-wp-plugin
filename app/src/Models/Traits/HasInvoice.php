<?php

namespace SureCart\Models\Traits;

use SureCart\Models\Invoice;

/**
 * If the model has an attached customer.
 */
trait HasInvoice {
	/**
	 * Set the affiliation attribute
	 *
	 * @param object $value Array of payout objects.
	 *
	 * @return void
	 */
	public function setInvoiceAttribute( $value ) {
		$this->setRelation( 'invoice', $value, Invoice::class );
	}
}
