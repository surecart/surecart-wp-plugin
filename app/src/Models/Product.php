<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Traits\HasPrice;

/**
 * Price model
 */
class Product extends Model {
	use HasPrice;
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
}
