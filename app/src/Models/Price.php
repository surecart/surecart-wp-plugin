<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Product;

/**
 * Price model
 */
class Price extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'prices';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'price';

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setProductAttribute( $value ) {
		$this->attributes['product'] = new Product( $value );
	}
}
