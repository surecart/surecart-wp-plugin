<?php

namespace CheckoutEngine\Models;

/**
 * Price model
 */
class SubscriptionItem extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'subscription_items';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'subscription_items';

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setPriceAttribute( $value ) {
		$this->attributes['price'] = new Price( $value );
	}
}
