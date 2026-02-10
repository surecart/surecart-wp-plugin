<?php
namespace SureCart\Models;

use SureCart\Models\Traits\HasAutoFeeRules;

/**
 * Holds the data of the order bump.
 */
class AutoFee extends Model {
	use HasAutoFeeRules;

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
