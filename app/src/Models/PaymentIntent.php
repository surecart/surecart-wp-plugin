<?php
namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Traits\HasCustomer;

/**
 * Payment intent model.
 */
class PaymentIntent extends Model {
	use HasCustomer;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'payment_intents';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'payment_intent';
}
