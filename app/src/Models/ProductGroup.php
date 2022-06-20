<?php

namespace SureCart\Models;

/**
 * Price model
 */
class ProductGroup extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'product_groups';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'product_group';

	/**
	 * Is this cachable?
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when products are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'products_updated_at';
}
