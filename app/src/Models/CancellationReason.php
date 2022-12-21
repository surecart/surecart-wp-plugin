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
	protected $endpoint = 'cancellation_reasons';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'cancellation_reason';

	/**
	 * Is this cachable?
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when cancellation_reason are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'cancellation_reason_updated_at';
}
