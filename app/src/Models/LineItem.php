<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasPrice;

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
