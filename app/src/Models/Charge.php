<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Subscription;
use CheckoutEngine\Models\CheckoutSession;
use CheckoutEngine\Models\Customer;

/**
 * Subscription model
 */
class Charge extends Model {
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

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setCheckoutSessionAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['checkout_session'] = $value;
			return;
		}
		$this->attributes['checkout_session'] = new CheckoutSession( $value );
	}

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setSubscriptionAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['subscription'] = $value;
			return;
		}
		$this->attributes['subscription'] = new Subscription( $value );
	}

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setCustomerAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['customer'] = $value;
			return;
		}
		$this->attributes['customer'] = new Customer( $value );
	}
}
