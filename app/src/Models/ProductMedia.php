<?php

namespace SureCart\Models;

/**
 * ProductMedia model
 */
class ProductMedia extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'product_medias';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'product_media';

	/**
	 * Does an update clear account cache?
	 *
	 * @var boolean
	 */
	protected $clears_account_cache = true;
}
