<?php

namespace SureCart\Models;

/**
 * Price model
 */
class Coupon extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'coupons';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'coupon';

	/**
	 * Is this cachable?
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when coupons are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'coupons_updated_at';
}
