<?php

namespace SureCart\Models;

/**
 * Holds the data of the current account.
 */
class Bump extends Model {
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
