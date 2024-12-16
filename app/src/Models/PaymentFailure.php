<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasDates;

/**
 * PaymentFailure model.
 */
class PaymentFailure extends Model {
	use HasDates;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'payment_failures';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'payment_failure';
}
