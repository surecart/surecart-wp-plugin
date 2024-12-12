<?php

namespace SureCart\Models;

/**
 * RefundItem model
 */
class RefundItem extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'refund_items';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'refund_item';
}
