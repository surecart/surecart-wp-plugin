<?php

namespace SureCart\Models;

/**
 * Swap model
 */
class Swap extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'swaps';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'swap';

	/**
	 * Set the swap price attribute
	 *
	 * @param Price $swap Swap.
	 *
	 * @return void
	 */
	public function setSwapPriceAttribute( $swap ) {
		$this->setRelation( 'swap_price', $swap, Price::class );
	}
}
