<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasDates;

/**
 * TaxRegistration model
 */
class TaxRegistration extends Model {
	use HasDates;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'tax_registrations';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'tax_registration';
}
