<?php

namespace SureCart\Models\Traits;

use SureCart\Models\Fee;

trait HasFees {
	/**
	 * Set the payouts attribute
	 *
	 * @param object $value Array of payout objects.
	 *
	 * @return void
	 */
	public function setFeesAttribute( $value ) {
		$this->setCollection( 'fees', $value, Fee::class );
	}
}
