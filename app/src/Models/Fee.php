<?php

namespace SureCart\Models;

use SureCart\Support\Currency;

/**
 * Fee model.
 */
class Fee extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'fees';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'fee';

	/**
	 * Set the prices attribute.
	 *
	 * @return string
	 */
	public function getDisplayAmountAttribute() {
		return Currency::format( $this->attributes['amount'] );
	}
}
