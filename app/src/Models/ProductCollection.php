<?php

namespace SureCart\Models;

/**
 * Holds Product Collection data.
 */
class ProductCollection extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'product_collections';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'product_collection';

	/**
	 * Is this cachable.
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when products are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'product_collections_updated_at';
}
