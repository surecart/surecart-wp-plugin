<?php

namespace SureCart\Models;
use SureCart\Models\Traits\HasDates;

/**
 * Price model
 */
class ProductGroup extends Model {
	use HasDates;

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
}
