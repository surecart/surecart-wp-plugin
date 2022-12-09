<?php

namespace SureCart\Models;

/**
 * Cancellation Reason Model
 */
class CancellationReason extends Model {
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
}
