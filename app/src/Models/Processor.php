<?php

namespace CheckoutEngine\Models;

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
}
