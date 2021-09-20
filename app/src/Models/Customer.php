<?php

namespace CheckoutEngine\Models;

/**
 * Price model
 */
class Customer extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'customers';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'customer';
}
