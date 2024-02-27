<?php

namespace SureCart\Models;

/**
 * Payout Group model
 */
class PayoutGroup extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'payout_groups';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'payout_group';

	/**
	 * Set the payouts attribute.
	 *
	 * @param  object $value Array of payout objects.
	 *
	 * @return void
	 */
	public function setPayoutsAttribute( $value ) {
		$this->setCollection( 'payouts', $value, Payout::class );
	}
}
