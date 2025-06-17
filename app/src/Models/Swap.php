<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasPrice;

/**
 * Swap model
 */
class Swap extends Model {
	use HasPrice;

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
