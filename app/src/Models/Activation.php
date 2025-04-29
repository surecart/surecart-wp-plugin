<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasDates;
use SureCart\Models\Traits\HasLicense;

/**
 * Activation model.
 */
class Activation extends Model {
	use HasDates;
	use HasLicense;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'activations';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'activation';
}
