<?php

namespace CheckoutEngine\Models\Traits;

use CheckoutEngine\Models\Customer;
use CheckoutEngine\Models\User;

/**
 * If the model has an attached customer.
 */
trait HasCustomer {
	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setCustomerAttribute( $value ) {
		$this->setRelation( 'customer', $value, Customer::class );
	}

	/**
	 * Find out which WordPress user this model belongs to.
	 *
	 * @return \WP_User|false
	 */
	public function getUser() {
		if ( empty( $this->attributes->customer ) ) {
			return false;
		}
		if ( is_string( $this->attributes->customer ) ) {
			return User::findByCustomerId( $this->attributes->customer );
		}
		if ( ! empty( $this->attributes->customer->id ) ) {
			return User::findByCustomerId( $this->attributes->customer->id );
		}
		return false;
	}
}
