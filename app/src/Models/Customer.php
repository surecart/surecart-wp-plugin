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

	/**
	 * Get a customer by their email address
	 *
	 * @param string $email Email address.
	 * @return this
	 */
	protected function byEmail( $email ) {
		return $this->where(
			[
				'email' => $email,
			]
		)->first();
	}
}
