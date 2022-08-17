<?php

namespace SureCart\Models;

/**
 * Order model
 */
class Order extends Model {
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
	 * Set the checkout attribute
	 *
	 * @param  object $value Checkout properties.
	 * @return void
	 */
	public function setCheckoutAttribute( $value ) {
		$this->setRelation( 'checkout', $value, Checkout::class );
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
		return $stat->where( $args )->find( 'orders' );
	}
}
