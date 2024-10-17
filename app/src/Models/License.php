<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasDates;

/**
 * Price model
 */
class License extends Model {
	use HasCustomer, HasDates;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'licenses';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'license';

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setPurchaseAttribute( $value ) {
		$this->setRelation( 'purchase', $value, Purchase::class );
	}
}
