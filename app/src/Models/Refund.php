<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCharge;
use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasRefundItems;

/**
 * Refund model.
 */
class Refund extends Model {
	use HasCustomer, HasCharge, HasRefundItems;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'refunds';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'refund';
}
