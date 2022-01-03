<?php

namespace CheckoutEngine\Models;

/**
 * Price model
 */
class CustomerLink extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'customer_links';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'customer_link';
}
