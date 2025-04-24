<?php

namespace SureCart\Models;

use SureCart\Models\Traits\CanResendNotifications;
use SureCart\Models\Traits\HasCheckout;
use SureCart\Models\Traits\HasDates;

/**
 * Order model
 */
class Order extends Model {
	use HasCheckout;
	use HasDates;
	use CanResendNotifications;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'orders';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'order';

	/**
	 * Get stats for the order.
	 *
	 * @param array $args Array of arguments for the statistics.
	 *
	 * @return \SureCart\Models\Statistic;
	 */
	protected function stats( $args = [] ) {
		$stat = new Statistic();
		return $stat->where( $args )->find( 'orders' );
	}
}
