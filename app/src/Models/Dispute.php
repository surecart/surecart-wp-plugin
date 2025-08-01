<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasCharge;
use SureCart\Models\Traits\HasDates;

/**
 * Dispute model.
 */
class Dispute extends Model {
	use HasCustomer;
	use HasCharge;
	use HasDates;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'disputes';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'dispute';
}