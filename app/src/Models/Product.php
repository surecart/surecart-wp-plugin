<?php

namespace SureCart\Models;

use SureCart\Models\Traits\CanPurgeFile;
use SureCart\Models\Traits\CanPurgeImage;

/**
 * Price model
 */
class Product extends Model {
	use CanPurgeImage, CanPurgeFile;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'products';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'product';

	/**
	 * Set the prices attribute.
	 *
	 * @param  object $value Array of price objects.
	 * @return void
	 */
	public function setPricesAttribute( $value ) {
		$this->setCollection( 'prices', $value, Price::class );
	}
}
