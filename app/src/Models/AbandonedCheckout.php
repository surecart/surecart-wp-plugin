<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\LineItem;
use CheckoutEngine\Models\Order;

/**
 * Order model
 */
class AbandonedCheckout extends Order {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'abandoned_checkouts';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'abandoned_checkout';

	/**
	 * Set the latest checkout session attribute
	 *
	 * @param  array $value Checkout session properties.
	 * @return void
	 */
	protected function setLatestOrderAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['latest_order'] = $value;
			return;
		}
		$this->attributes['latest_order'] = new Order( $value );
	}

	/**
	 * Set the latest checkout session attribute
	 *
	 * @param  array $value Customer properties.
	 * @return void
	 */
	protected function setCustomerAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['customer'] = $value;
			return;
		}
		$this->attributes['customer'] = new Customer( $value );
	}
}
