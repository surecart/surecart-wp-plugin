<?php

namespace SureCart\Models;

use SureCart\Support\Currency;

/**
 * Price model
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
	 * Get the display amount attribute
	 *
	 * @return string
	 */
	protected function getDisplayAmountAttribute() {
		return Currency::format( $this->amount );
	}
}
