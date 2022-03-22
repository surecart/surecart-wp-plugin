<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Order;

/**
 * Order model
 */
class AbandonedOrder extends Order {
	use HasCustomer;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'abandoned_orders';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'abandoned_order';

	/**
	 * Set the latest checkout session attribute
	 *
	 * @param  array $value Checkout session properties.
	 * @return void
	 */
	protected function setLatestOrderAttribute( $value ) {
		$this->setRelation( 'latest_order', $value, Order::class );
	}

	/**
	 * Get the relation id attribute
	 *
	 * @return string
	 */
	public function getLatestOrderIdAttribute() {
		return $this->getRelationId( 'latest_order' );
	}
}
