<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCheckout;
use SureCart\Models\Traits\HasPrice;
use SureCart\Models\Traits\HasSubscription;

/**
 * Period model
 */
class Period extends Model {
	use HasSubscription, HasCheckout, HasPrice;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'periods';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'period';

}

