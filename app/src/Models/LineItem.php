<?php

namespace CheckoutEngine\Models;

/**
 * Price model
 */
class LineItem extends Model {
	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'line_item';

	/**
	 * Set the price attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setPriceAttribute( $value ) {
		$this->attributes['price'] = new Price( $value );
	}
}
