<?php
namespace SureCart\Models;

use SureCart\Support\Currency;

/**
 * ServiceFee model
 */
class ServiceFee extends Model {
	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'service_fee';

	/**
	 * Get the base display amount.
	 *
	 * @return string
	 */
	public function getDisplayAmountAttribute() {
		return Currency::format( $this->amount, $this->currency );
	}
}
