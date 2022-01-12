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

	/**
	 * Get the customer's user.
	 *
	 * @return string|null
	 */
	public function getUser() {
		return User::findByCustomerId( $this->id );
	}

	/**
	 * Maybe also return the user when the id is set.
	 *
	 * @param string $value The user id.
	 * @return void
	 */
	public function setIdAttribute( $value ) {
		$this->attributes['id'] = $value;
		if ( in_array( 'user', $this->query['expand'] ) ) {
			$this->attributes['user'] = $this->getUser();
		}
	}
}
