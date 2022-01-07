<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Subscription;
use CheckoutEngine\Models\Order;
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
	public function setOrderAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['order'] = $value;
			return;
		}
		$this->attributes['order'] = new Order( $value );
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
