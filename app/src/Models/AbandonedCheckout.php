<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Order;

/**
 * Order model
 */
class AbandonedCheckout extends Order {
	use HasCustomer;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'abandoned_checkouts';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'abandoned_checkout';

	/**
	 * Set the latest checkout session attribute
	 *
	 * @param  array $value Checkout session properties.
	 * @return void
	 */
	protected function setLatestRecoverableCheckoutAttribute( $value ) {
		$this->setRelation( 'latest_recoverable_checkout', $value, Checkout::class );
	}

	/**
	 * Get the relation id attribute
	 *
	 * @return string
	 */
	public function getLatestRecoverableCheckoutIdAttribute() {
		return $this->getRelationId( 'latest_recoverable_checkout' );
	}
}
