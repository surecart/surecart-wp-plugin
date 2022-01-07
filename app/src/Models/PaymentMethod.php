<?php
namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Traits\HasCustomer;
use CheckoutEngine\Models\Traits\HasPaymentIntent;

/**
 * Payment intent model.
 */
class PaymentMethod extends Model {
	use HasCustomer, HasPaymentIntent;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'payment_methods';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'payment_method';
}
