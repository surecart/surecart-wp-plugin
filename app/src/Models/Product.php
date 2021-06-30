<?php

namespace CheckoutEngine\Models;

/**
 * Price model
 */
class Product extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'products';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'product';

	/**
	 * Set the prices attribute.
	 *
	 * @param  array $value Array of price objects.
	 * @return void
	 */
	public function setPricesAttribute( $value ) {
		$models = [];
		if ( ! empty( $value ) && is_array( $value ) ) {
			foreach ( $value as $attributes ) {
				$models[] = new Price( $attributes );
			}
		}
		$this->attributes['prices'] = $models;
	}
}
