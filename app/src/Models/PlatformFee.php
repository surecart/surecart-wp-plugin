<?php
namespace SureCart\Models;

use SureCart\Support\Currency;

/**
 * PlatformFee model
 */
class PlatformFee extends Model {
	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'platform_fee';

	/**
	 * Get the start at date.
	 *
	 * @return string
	 */
	public function getBaseDisplayAmountAttribute() {
		return Currency::format( $this->base_amount, $this->currency );
	}
	
}
