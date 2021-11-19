<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\LineItem;
use CheckoutEngine\Models\CheckoutSession;

/**
 * CheckoutSession model
 */
class AbandonedCheckout extends CheckoutSession {
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
	protected function setLatestCheckoutSessionAttribute( $value ) {
		if ( is_string( $value ) ) {
			$this->attributes['latest_checkout_session'] = $value;
			return;
		}
		$this->attributes['latest_checkout_session'] = new CheckoutSession( $value );
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
