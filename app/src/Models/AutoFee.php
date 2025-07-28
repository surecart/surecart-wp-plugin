<?php
namespace SureCart\Models;

/**
 * Holds the data of the order bump.
 */
class AutoFee extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'auto_fees';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'auto_fee';
}
