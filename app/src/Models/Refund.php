<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Traits\HasCharge;
use CheckoutEngine\Models\Traits\HasCustomer;
/**
 * Subscription model
 */
class Refund extends Model {
	use HasCustomer, HasCharge;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'refunds';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'refund';

	/**
	 * Does the refund apply to a specific price id?
	 *
	 * @param string $id string to search for.
	 * @return boolean true if found, false if not.
	 */
	protected function hasPriceId( $id = '' ) {
		$price_ids = (array) $this->attributes['metadata']['price_ids'] ?? [];
		return empty( $price_ids ) ? false : in_array( $id, $price_ids, true );
	}

	/**
	 * Does the refund have these specific price ids?
	 *
	 * @param array $ids List of ids.
	 * @return boolean true if found, false if not.
	 */
	public function hasPriceIds( $ids = [] ) {
		$price_ids = (array) $this->attributes['metadata']['price_ids'] ?? [];
		return ! array_diff( $ids, $price_ids );
	}

	/**
	 * Apply the refund for a specific price id.
	 *
	 * @param string $id Price id.
	 * @return $this
	 */
	protected function forPriceId( $id = '' ) {
		$this->attributes['metadata']['price_ids'] = [ $id ];
		return $this;
	}

	/**
	 * Apply the refund for a specific price ids.
	 *
	 * @param array $ids Price ids.
	 * @return $this
	 */
	protected function forPriceIds( $ids = [] ) {
		$this->attributes['metadata']['price_ids'] = (array) $ids;
		return $this;
	}
}
