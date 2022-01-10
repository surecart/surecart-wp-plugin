<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Traits\HasCustomer;
use CheckoutEngine\Models\Traits\HasOrder;
use CheckoutEngine\Models\Traits\HasSubscription;

/**
 * Subscription model
 */
class Charge extends Model {
	use HasCustomer, HasOrder, HasSubscription;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'charges';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'charge';
}
