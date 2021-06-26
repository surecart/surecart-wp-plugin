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
	 * Don't fill product
	 *
	 * @var array
	 */
	protected $guarded = [ 'product' ];
}
