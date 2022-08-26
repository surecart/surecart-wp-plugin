<?php

namespace SureCart\Models;

/**
 * Price model
 */
class License extends Model {
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
