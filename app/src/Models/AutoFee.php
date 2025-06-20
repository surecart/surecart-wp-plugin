<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasDates;
use SureCart\Models\Traits\HasPrice;
use SureCart\Support\Currency;

/**
 * Holds the data of the order bump.
 */
class AutoFee extends Model {
	use HasDates;
	use HasPrice;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'auto_fees';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'auto_fee';
}
