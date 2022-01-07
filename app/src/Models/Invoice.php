<?php
namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Traits\HasCustomer;
use CheckoutEngine\Models\Traits\HasSubscription;
use CheckoutEngine\Models\Traits\HasPaymentIntent;
use CheckoutEngine\Models\Traits\HasPaymentMethod;

class Invoice extends Model {
	use HasCustomer, HasSubscription, HasPaymentIntent, HasPaymentMethod;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'invoices';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'invoice';
}
