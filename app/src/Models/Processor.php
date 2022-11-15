<?php

namespace SureCart\Models;

/**
 * Processor model.
 */
class Processor extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'processors';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'processor';

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
	protected $cache_key = 'processors_updated_at';
}
