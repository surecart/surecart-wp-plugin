<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasDates;

/**
 * Holds balance transaction data
 */
class BalanceTransaction extends Model {
	use HasDates;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'balance_transactions';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'balance_transaction';
}
