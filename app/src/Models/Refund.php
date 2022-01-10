<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Traits\HasCharge;
use CheckoutEngine\Models\Traits\HasCustomer;
/**
 * Subscription model
 */
class Refund extends Model {
	use HasCustomer, HasCharge;

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
