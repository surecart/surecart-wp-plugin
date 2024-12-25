<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasLineItem;

/**
 * RefundItem model.
 */
class RefundItem extends Model {
	use HasLineItem;

	/**
	 * Rest API endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'refund_items';

	/**
	 * Object name.
	 *
	 * @var string
	 */
	protected $object_name = 'refund_item';
}
