<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasDates;

/**
 * Holds the data of the order bump.
 */
class Bump extends Model {
	use HasDates;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'bumps';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'bump';
}
