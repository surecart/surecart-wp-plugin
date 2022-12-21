<?php

namespace SureCart\Models;

/**
 * Cancellation Reason Model
 */
class CancellationAct extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'cancellation_acts';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'cancellation_act';
}
