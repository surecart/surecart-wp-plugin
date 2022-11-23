<?php

namespace SureCart\Models;

/**
 * Holds the data of the current account.
 */
class VerificationCode extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'verification_codes';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'verification_code';
}
