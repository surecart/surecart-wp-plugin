<?php

namespace CheckoutEngine\Models;

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
	 * Don't fill product
	 *
	 * @var array
	 */
	protected $guarded = [ 'product' ];
}
