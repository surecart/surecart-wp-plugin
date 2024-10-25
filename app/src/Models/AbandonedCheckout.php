<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCheckout;
use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasDates;
use SureCart\Models\Traits\HasPromotion;
use SureCart\Support\TimeDate;

/**
 * Order model
 */
class AbandonedCheckout extends Model {
	use HasCustomer, HasCheckout, HasDates, HasPromotion;

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
		$this->setRelation( 'recovered_checkout', $value, Checkout::class );
	}

	/**
	 * Get stats for the order.
	 *
	 * @param array $args Array of arguments for the statistics.
	 *
	 * @return \SureCart\Models\Statistic;
	 */
	protected function stats( $args = [] ) {
		$stat = new Statistic();
		return $stat->where( $args )->find( 'abandoned_checkouts' );
	}

	/**
	 * Get the notifications scheduled at date and time attribute.
	 *
	 * @return string
	 */
	public function getNotificationsScheduledAtDateTimeAttribute() {
		return array_map( function( $scheduled_at ) {
			return TimeDate::formatDateAndTime( $scheduled_at );
		}, $this->notifications_scheduled_at );
	}
}
