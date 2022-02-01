<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Traits\HasPrice;

/**
 * Price model
 */
class LineItem extends Model {
	use HasPrice;

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'line_item';
}
