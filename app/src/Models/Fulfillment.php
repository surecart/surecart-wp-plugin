<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasDates;

/**
 * Fulfillment model.
 */
class Fulfillment extends Model {
	use HasDates;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'fulfillments';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'fulfillment';

	/**
	 * Set the prices attribute.
	 *
	 * @param  object $value Array of price objects.
	 * @return void
	 */
	public function setFulfillmentItemsAttribute( $value ) {
		$this->setCollection( 'fulfillment_items', $value, FulfillmentItem::class );
	}
}
